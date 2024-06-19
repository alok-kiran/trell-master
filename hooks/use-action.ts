import { useState, useCallback } from 'react';
import { ActionState, FieldErrors } from '@/lib/create-safe-action';

type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>;

interface UseActionOptions<TInput, TOutput> {
    onSuccess?: (data: TOutput) => void;
    onError?: (error: string) => void;
    onComplete?: () => void;
}

export const useAction = <TInput, TOutput>(
    action: Action<TInput, TOutput>,
    options: UseActionOptions<TInput, TOutput> = {}
) => {
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput>>({});
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TOutput | null>(null);

    const run = useCallback(async (data: TInput) => {
        setLoading(true);
        setFieldErrors({});
        setError(null);

        const result = await action(data);

        if (result?.fieldErrors) {
            setFieldErrors(result.fieldErrors);
        }

        if (result?.error) {
            setError(result.error);
            options.onError?.(result.error);
        }

        if (result?.data) {
            setData(result.data);
            options.onSuccess?.(result.data);
        }

        options.onComplete?.();
        setLoading(false);
    }, [action, options]);

    return {
        loading,
        fieldErrors,
        error,
        run,
        data,
    };
}