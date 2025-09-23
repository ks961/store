
export type InputErrorProps = {
    error?: string
}

export default function InputError({
    error
}: InputErrorProps) {
    return (
        <>
            { error ? 
                    <span className="text-red-600 text-sm">
                        {error}
                    </span> : 
                null 
            }
        </>
    );
}