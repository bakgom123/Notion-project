/* trunk-ignore-all(prettier) */
"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
    documentId: Id<"documents">;
}

export const Banner = ({
    documentId
}: BannerProps) => {
    const router = useRouter();

    // useMutation 훅을 사용하여 API 호출을 위한 mutation 함수들을 설정해줌
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    // 문서를 삭제하는 함수
    const onRemove = () => {
        // remove mutation 함수를 호출하고 결과를 promise에 할당
        const promise = remove({ id: documentId });
        // toast.promise를 사용하여 비동기 작업의 상태를 사용자에게 알려줌
        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });
        // 문서가 삭제된 후 문서 목록 페이지로 이동!
        router.push("/documents");
    };

    // 문서를 복원하는 함수
    const onRestore = () => {
        const promise = restore({ id: documentId })
        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>
                This page is in the Trash.
            </p>
             {/* 복원 버튼 */}
            <Button
                size="sm"
                onClick={onRestore}
                variant="outline"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore page
            </Button>
            {/* 완전 삭제를 위한 확인 모달과 삭제 버튼 */}
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    )
}