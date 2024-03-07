"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// TitleProps 인터페이스 정의
interface TitleProps {
    initialData: Doc<"documents">;
}

export const Title = ({
    initialData
}: TitleProps) => {
    // useRef를 사용한 input 요소의 참조
    const inputRef = useRef<HTMLInputElement>(null);

    // useMutation을 사용하여 update 함수 가져오기
    const update = useMutation(api.documents.update);

    // useState를 사용하여 title과 isEditing 상태 변수 선언
    const [title, setTitle] = useState(initialData.title || "Untitled");
    const [isEditing, setIsEditing] = useState(false);

    // 입력 상태 활성화 함수
    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        // 입력 상태가 활성화되면 포커스 설정 및 텍스트 선택
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0);
    };

    // 입력 상태 비활성화 함수
    const disableInput = () => {
        setIsEditing(false);
    };

     // 입력값 변경 이벤트 핸들러
    const onChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value);
        // update 함수를 사용하여 문서의 title 업데이트
        update({
            id: initialData._id,
            title: event.target.value || "Untitled"
        });
    };

    // 키보드 입력 이벤트 핸들러
    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        // Enter 키를 누르면 입력 상태 비활성화
        if (event.key === "Enter") {
            disableInput();
        }
    }
    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate">
                        {initialData.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-20 rounded-md" />
    )
}