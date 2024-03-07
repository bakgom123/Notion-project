"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
    documentId: Id<"documents">;
}

export const Menu = ({
    documentId
}: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();

    // Convex를 사용하여 문서를 아카이브(삭제)하는 Mutation 훅
    const archive = useMutation(api.documents.archive);

    // 문서를 아카이브하는 함수
    const onArchive = () => {
        // 아카이브 Mutation을 호출하고 결과를 promise에 할당
        const promise = archive({ id: documentId });
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note."
        });
        router.push("/documents");
    };

    return (
        <DropdownMenu>
            {/* 드롭다운 메뉴의 트리거 부분 */}
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                    {/* 더보기 아이콘 */}
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            {/* 드롭다운 메뉴의 컨텐츠 부분 */}
            <DropdownMenuContent
                className="w-60"
                align="end"
                alignOffset={8}
                forceMount
            >
                {/* 아카이브 항목 */}
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 {/* 사용자 정보 표시 항목 */}
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-10 w-10" />
    )
}