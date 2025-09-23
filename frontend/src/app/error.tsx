"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type GlobalError = {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalError) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <html>
            <body className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Something went wrong</h1>
                    <p className="mt-2 text-gray-600">{error.message}</p>
                    <p className="mt-4">Redirecting you to home in 5 seconds…</p>
                </div>
            </body>
        </html>
    );
}