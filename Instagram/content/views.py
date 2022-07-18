from uuid import uuid4
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from user.models import User
from .models import Feed, Reply, Like, Bookmark
import os
from instagram.settings import MEDIA_ROOT


class Main(APIView):
    def get(self, request):
        email = request.session.get('email', None)  # 이렇게 설정해서 로그아웃을 눌렀을 때 에러대신 로그인 페이지 나오게
        if email is None:
            return render(request, "user/login.html")
        user = User.objects.filter(email=email).first()
        if user is None:
            return render(request, "user/login.html")

        feed_object_list = Feed.objects.all().order_by('-id')  # select * from content_feed 랑 같은 역활
        # order_by - 업데이트 되는 순서대로, 먼저 올린 피드는 내려가게
        feed_list = []

        for feed in feed_object_list:
            user = User.objects.filter(email=feed.email).first()
            reply_object_list = Reply.objects.filter(feed_id=feed.id)
            reply_list = []
            for reply in reply_object_list:
                user = User.objects.filter(email=reply.email).first()
                reply_list.append(dict(reply_content=reply.reply_content,
                                       nickname=user.nickname))

            like_count = Like.objects.filter(feed_id=feed.id, is_like=True).count()
            is_liked = Like.objects.filter(feed_id=feed.id, email=email, is_like=True).exists()
            is_marked = Bookmark.objects.filter(feed_id=feed.id, email=email, is_marked=True).exists()
            feed_list.append(dict(id=feed.id,
                                  image=feed.image,
                                  content=feed.content,
                                  like_count=like_count,
                                  profile_image=user.profile_image,
                                  nickname=user.nickname,
                                  reply_list=reply_list,
                                  is_liked=is_liked,
                                  is_marked=is_marked
                                  ))

        return render(request, "instagram/main.html", context=dict(feeds=feed_list, user=user))


class UploadFeed(APIView):
    def post(self, request):
        file = request.FILES['file']
        # image 이름을 랜덤하게 생성하는 코드
        uuid_name = uuid4().hex
        save_path = os.path.join(MEDIA_ROOT, uuid_name)
        # 파일을 읽어서 파일로 만들때 쓰는 코드
        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        image = uuid_name
        content = request.data.get('content')
        email = request.session.get('email', None)  # 세션에서 들고 오기로,,,

        Feed.objects.create(image=image, content=content, email=email)

        return Response(status=200)


class Profile(APIView):
    def get(self, request):
        email = request.session.get('email', None)  # 이렇게 설정해서 로그아웃을 눌렀을 때 에러대신 로그인 페이지 나오게
        if email is None:
            return render(request, "user/login.html")
        user = User.objects.filter(email=email).first()
        if user is None:
            return render(request, "user/login.html")

        feed_list = Feed.objects.filter(email=email).all()
        like_list = list(Like.objects.filter(email=email, is_like=True).values_list('feed_id', flat=True))
        like_feed_list = Feed.objects.filter(id__in=like_list)
        bookmark_list = list(Bookmark.objects.filter(email=email, is_marked=True).values_list('feed_id', flat=True))
        bookmark_feed_list = Feed.objects.filter(id__in=bookmark_list)
        return render(request, 'content/profile.html', context=dict(feed_list=feed_list,
                                                                    user=user,
                                                                    like_feed_list=like_feed_list,
                                                                    bookmark_feed_list=bookmark_feed_list))



class UploadReply(APIView):
    def post(self, request):
        feed_id = request.data.get('feed_id', None)
        reply_content = request.data.get('reply_content', None)
        email = request.session.get('email', None)

        Reply.objects.create(feed_id=feed_id, reply_content=reply_content, email=email)
        return Response(status=200)


class ToggleLike(APIView):
    def post(self, request):
        feed_id = request.data.get('feed_id', None)
        favorite_text = request.data.get('favorite_text', None)
        if favorite_text == 'favorite_border':
            is_like = True
        else:
            is_like = False
        email = request.session.get('email', None)
        like = Like.objects.filter(feed_id=feed_id, email=email).first()
        if like:
            like.is_like = is_like
            like.save()
        else:
            Like.objects.create(feed_id=feed_id, is_like=is_like, email=email)
        return Response(status=200)




class ToggleBookmark(APIView):
    def post(self, request):
        feed_id = request.data.get('feed_id', None)
        bookmark_text = request.data.get('bookmark_text', None)
        if bookmark_text == 'bookmark_border':
            is_marked = True
        else:
            is_marked = False
        email = request.session.get('email', None)
        bookmark = Bookmark.objects.filter(feed_id=feed_id, email=email).first()
        if bookmark:
            bookmark.is_marked = is_marked
            bookmark.save()
        else:
            Bookmark.objects.create(feed_id=feed_id, is_marked=is_marked, email=email)
        return Response(status=200)
