import { useForm, UseFormProps, FieldValues, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

export type UseZodFormReturn<T extends FieldValues = any> = UseFormReturn<T>;

export function useZodForm<T extends FieldValues>({ schema, ...props }: { schema: ZodType<T> } & UseFormProps<T>) {
  return useForm<T>({ resolver: zodResolver(schema as any), ...props });
}