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
    // dynamic 함수를 사용하여 에디터 컴포넌트 동적으로 불러오기
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

    // 문서 데이터 가져오기
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId
    });

    // 문서 업데이트 Mutation 사용
    const update = useMutation(api.documents.update);

    // 에디터 내용 변경 이벤트 핸들러
    const onChange = (content: string) => {
        // 업데이트 Mutation 호출
        update({
            id: params.documentId,
            content
        })
    }
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
    // 문서가 없는 경우 메시지 표시
    if (document === null) {
        return <div>Not found.</div>
    }
    return (
        <div className="pb-40">
            {/* Cover 컴포넌트를 사용하여 문서 미리보기 표시 */}
            <Cover preview url={document.coverImage} />
            {/* 문서 편집 툴바 및 에디터 표시 */}
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                {/* 툴바 컴포넌트 표시 */}
                <Toolbar preview initialData={document} />
                {/* 에디터 컴포넌트 표시 (편집 불가능 상태) */}
                <Editor
                    editable={false}
                    onChange={onChange}
                    initialContent={document.content}
                />
            </div>
        </div>
    )
}

export default DocumentIdPage;