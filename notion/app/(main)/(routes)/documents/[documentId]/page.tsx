"use client";

import { Cover } from "@/components/cover";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    };
};

const DocumentIdPage = ({
    params
}: DocumentIdPageProps) => {
    // 동적으로 import되는 Editor 컴포넌트를 useMemo로 래핑하여 SSR 비활성화
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

    // documents.getById 쿼리를 사용하여 문서 정보 가져오기
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    // documents.update 뮤테이션 훅 초기화
    const update = useMutation(api.documents.update);

     // 에디터 내용 변경 이벤트 핸들러
    const onChange = (content: string) => {
        // documents.update 뮤테이션을 사용하여 문서 내용 업데이트
        update({
            id: params.documentId,
            content
        })
    }
    // 문서가 로딩 중인 경우
    if (document === undefined) {
        return (
            <div>
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-4 w-[60%]" />
                    </div>
                </div>
            </div>
        )
    }
    // 문서가 존재하지 않는 경우
    if (document === null) {
        return <div>Not found.</div>
    }
    return (
        <div className="pb-40">
            {/* Cover 컴포넌트로 문서 커버 이미지 표시 */}
            <Cover url={document.coverImage} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                {/* 툴바 및 에디터 컴포넌트 표시 */}
                <Toolbar initialData={document} />
                <Editor
                    onChange={onChange}
                    initialContent={document.content}
                />
            </div>
        </div>
    )
}

export default DocumentIdPage;