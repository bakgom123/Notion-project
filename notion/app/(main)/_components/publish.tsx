"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

// PublishProps 인터페이스 정의
interface PublishProps {
    initialData: Doc<"documents">
};

export const Publish = ({
    initialData
}: PublishProps) => {
    // useOrigin 훅을 사용하여 origin 값 가져오기
    const origin = useOrigin();

    // useMutation 훅을 사용하여 update 함수 가져오기
    const update = useMutation(api.documents.update);

    // 상태 변수들 선언
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 게시된 노트의 URL 생성
    const url = `${origin}/preview/${initialData._id}`;

    // 노트를 게시하는 함수
    const onPublish = () => {
        setIsSubmitting(true);
        // update 함수를 사용하여 isPublished 값을 ture로 업데이트
        const promise = update({
            id: initialData._id,
            isPublished: true
        })
            .finally(() => setIsSubmitting(false));
        toast.promise(promise, {
            loading: "Publishing...",
            success: "Note published!",
            error: "Failed to publish note."
        });
    };

    // 노트의 게시를 취소하는 함수
    const onUnpublish = () => {
        setIsSubmitting(true);
        // update 함수를 사용하여 isPublished 값을 false로 업데이트
        const promise = update({
            id: initialData._id,
            isPublished: false
        })
            .finally(() => setIsSubmitting(false));
        toast.promise(promise, {
            loading: "Unpublishing...",
            success: "Note unpublished!",
            error: "Failed to unpublish note."
        });
    };

    // URL을 클립보드에 복사하는 함수
    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        // 복사 완료 후 1초 뒤에 copied 상태를 false로 업데이트
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {/* 이미 게시된 노트인 경우 아이콘 추가 */}
                    {initialData.isPublished && (
                        <Globe
                            className="text-sky-500 w-4 h-4 ml-2"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {/* 게시된 노트의 정보 표시 */}
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 animate-pulse h-4 w-4" />
                            <p className="text-xs font-medium text-sky-500">
                                This note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            {/* 노트의 URL을 표시하는 입력란 */}
                            <input
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />
                            {/* URL 복사 버튼 */}
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                         {/* 게시 취소 버튼 */}
                        <Button
                            size="sm"
                            className="w-full text-xs"
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Globe
                            className="h-8 w-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Sharer your work with others.
                        </span>
                        {/* 게시 버튼 */}
                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}