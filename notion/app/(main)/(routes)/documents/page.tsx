"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
    // useRouter 훅을 사용하여 현재 페이지의 라우터 정보 가져오기
    const router = useRouter();

    // useUser 훅을 사용하여 현재 사용자 정보 가져오기
    const { user } = useUser();

    // documents.create 뮤테이션 훅 초기화
    const create = useMutation(api.documents.create);

    // 노트 생성 버튼 클릭 이벤트 핸들러
    const onCreate = () => {
        // documents.create 뮤테이션을 사용하여 새로운 노트 생성
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`))
        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image src="/empty.png" height="300" width="300" alt="Empty" className="dark:hidden" />
            <Image src="/empty-dark.png" height="300" width="300" alt="Empty" className="hidden dark:block" />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s Yootion
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a note
            </Button>
        </div>
    );
}

export default DocumentsPage;