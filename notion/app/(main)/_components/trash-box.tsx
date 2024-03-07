"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
    // useRouter와 useParams를 사용하여 현재 라우터 및 URL 파라미터 정보 가져오기
    const router = useRouter();
    const params = useParams();

    // useQuery를 사용하여 휴지통에 있는 문서 목록 가져오기
    const documents = useQuery(api.documents.getTrash);

    // useMutation을 사용하여 문서 복원 및 삭제 함수 가져오기
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    // useState를 사용하여 검색어 및 로딩 상태 변수 선언
    const [search, setSearch] = useState("");

    // 검색어에 따라 문서를 필터링한 목록 생성
    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    // 문서 클릭 이벤트 핸들러
    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    // 문서 복원 이벤트 핸들러
    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });
        toast.promise(promise, {
            loading: "Restoring nore...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };

    // 문서 삭제 이벤트 핸들러
    const onRemove = (
        documentId: Id<"documents">
    ) => {
        const promise = remove({ id: documentId });
        toast.promise(promise, {
            loading: "Deleting nore...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });
        // 현재 페이지가 삭제된 문서의 페이지인 경우 문서 목록으로 이동
        if (params.documentId === documentId) {
            router.push("/documents");
        }
        // documents가 로딩 중인 경우 로딩 스피너 표시
        if (documents === undefined) {
            return (
                <div className="h-full flex items-center justify-center p-4">
                    <Spinner size="lg" />
                </div>
            )
        };
    }



    return (
        <div className="text-sm">
            {/* 검색 입력창 */}
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by page title..."
                />
            </div>
            {/* 문서 목록 */}
            <div className="mt-2 px-1 pb-1">
                {/* 문서가 없는 경우 안내 메시지 표시 */}
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No documents found.
                </p>
                {/* 문서 목록 매핑 */}
                {filteredDocuments?.map((document) => (
                    <div
                        key={document._id}
                        role="button"
                        onClick={() => onClick(document._id)}
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        {/* 문서 복원 및 삭제 버튼 */}
                        <div className="flex items-center">
                            {/* 문서 복원 버튼 */}
                            <div
                                onClick={(e) => onRestore(e, document._id)}
                                role="button"
                                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                            >
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>
                             {/* 문서 삭제 버튼 */}
                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                >
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

