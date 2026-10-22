"use client";

import { useRouter } from "next/navigation";
import DocumentForm from "@/components/DocumentForm";

export default function UploadPage() {
    const router = useRouter();

    function handleSaved() {
        router.push("/dashboard");
    }

    return (
        <div className="relative min-h-screen bg-[#00008B] overflow-hidden py-12 px-4">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Add New Document
                    </h1>
                    <p className="mt-3 text-lg text-blue-200">
                        Paste your educational content or upload a PDF to add it to your dashboard.
                    </p>
                </div>

                <DocumentForm onSaved={handleSaved} />
            </div>
        </div>
    );
}
