// src/app/upload/page.jsx
"use client";

import { useRouter } from "next/navigation";
import DocumentForm from "@/components/DocumentForm";

export default function UploadPage() {
    const router = useRouter();

    function handleSaved() {
        router.push("/dashboard");
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Add New Document
                </h1>
                <p className="mt-2 text-gray-600">
                    Upload a PDF or paste your educational content below to add it to your dashboard.
                </p>
            </div>

            <DocumentForm onSaved={handleSaved} />
        </div>
    );
}