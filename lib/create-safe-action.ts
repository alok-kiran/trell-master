import { z } from "zod";

export type FieldErrors<T> = {
    [K in keyof T]?: string[];
}

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?: string | '';
    data?: TOutput;
};

export const createSafeAction = <TInput, TOutput>(
    schema: z.Schema<TInput>,
    handler: (validatedInput: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
    return async (input: TInput): Promise<ActionState<TInput, TOutput>> => {
        const validatedFields = schema.safeParse(input);
        if (!validatedFields.success) {
            return {
                fieldErrors: validatedFields.error.flatten().fieldErrors as FieldErrors<TInput>,
            };
        }
        return handler(validatedFields.data);
    }
}