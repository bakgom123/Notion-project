"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocuemtListProps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?: Doc<"documents">[];
}

export const DocumentList = ({
    parentDocumentId,
    level = 0
}: DocuemtListProps) => {
    // URL 파라미터 및 라우터 설정
    const params = useParams();
    const router = useRouter();

    // 문서 목록의 확장 상태를 관리하는 상태 변수
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }));
    };

    // Convex를 사용하여 문서 목록을 가져오는 Query
    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId
    });
    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    // 문서 목록이 로딩 중인 경우, 로딩 스켈레톤 UI를 표시해줌
    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    };

    return (
        <>
            <p
                style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
                className={cn("hidden text-sm font-medium font-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside.
            </p>
            {documents.map((document) => (
                <div key={document._id}>
                    {/* 각 문서에 대한 UI 컴포넌트인 Item을 렌더링 */}
                    <Item 
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        documentIcon={document.icon}
                        active={params.documentId === document._id}
                        level={level}
                        onExpand={() => onExpand(document._id)}
                        expanded={expanded[document._id]}
                    />
                    {/*  call DocumentList component - recursive */}
                    {/*  rerender it when expanded object holds the document._id and the value is true */}
                    {expanded[document._id] && (
                        <DocumentList parentDocumentId={document._id} level={level +1} />
                    )}
                </div>
            ))}
        </>
    )
}