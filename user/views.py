import os
from uuid import uuid4

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from instagram.settings import MEDIA_ROOT
from .models import User
from django.contrib.auth.hashers import make_password

class MakeAccount(APIView):
    def get(self, request):
        return render(request, "user/makeAccount.html")

    def post(self, request):
        email = request.data.get('email', None)
        nickname = request.data.get('nickname', None)
        name = request.data.get('name', None)
        password = request.data.get('password', None)

        User.objects.create(email=email,
                            nickname=nickname,
                            name=name,
                            password=make_password(password),
                            profile_image="default_profile.png")
        return Response(status=200, data=dict(message="회원가입 성공했습니다. 로그인 해주세요."))

class Login(APIView):
    def get(self, request):
        return render(request, "user/login.html")

    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        # 이메일이 unique하기 때문에 first()를 써서 바로 찾게 만듦, for문을 대신해서 더 간편하게 만든거임.
        user = User.objects.filter(email=email).first()
        if user is None:
            return Response(status=400, data=dict("회원정보가 잘못되었습니다."))

        if user.check_password(password):
            # TODO 로그인을 했다. 세션 or 쿠키
            request.session['email'] = email
            return Response(status=200)
        else:
            return Response(status=400, data=dict("회원정보가 잘못되었습니다."))


class LogOut(APIView):
    def get(self, request):
        request.session.flush()
        return render(request, "user/login.html")


class UploadProfile(APIView):
    def post(self, request):
        file = request.FILES['file']
        email = request.data.get('email')
        # image 이름을 랜덤하게 생성하는 코드
        uuid_name = uuid4().hex
        save_path = os.path.join(MEDIA_ROOT, uuid_name)
        # 파일을 읽어서 파일로 만들때 쓰는 코드
        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        profile_image = uuid_name

        user = User.objects.filter(email=email).first()

        user.profile_image = profile_image
        user.save()

        return Response(status=200)
