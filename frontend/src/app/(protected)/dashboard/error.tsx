'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div>
            <p className="text-red-500">Error: {error.message}</p>
            <button onClick={reset}>Try again</button>
        </div>
    );
}