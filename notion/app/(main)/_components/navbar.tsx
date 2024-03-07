"use client";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
};

export const Navbar = ({
    isCollapsed,
    onResetWidth
}: NavbarProps) => {
    const params = useParams();
    // Convex를 사용하여 문서 정보를 가져오는 Query 훅
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">,
    });
    // 문서 정보가 로딩 중인 경우 로딩 스켈레톤 표시해주기!
    if (document === undefined) {
        return (
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        )
    }
     // 문서 정보가 없는 경우 null을 반환하여 해당 네비게이션 바를 렌더링하지 않음
    if (document === null) {
        return null;
    }
    return (
        <>
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
                {/* 네비게이션 바 축소 상태에서는 메뉴 아이콘을 표시해줌. */}
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                {/* 타이틀, 퍼블리시 기능, 메뉴 등을 표시하는 섹션 */}
                <div className="flex items-center justify-between w-full">
                    <Title initialData={document} />
                    <div className="flex items-center gap-x-2">
                        <Publish initialData={document} />
                        <Menu documentId={document._id} />
                    </div>
                </div>
            </nav>
            {/* 문서가 아카이브된 경우 배너를 표시해줌 */}
            {document.isArchived && (
                <Banner documentId={document._id} />
            )}
        </>
    )
}