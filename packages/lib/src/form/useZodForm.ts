import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

export function useZodForm<T extends FieldValues>({ schema, ...props }: { schema: ZodType<T> } & UseFormProps<T>) {
  return useForm<T>({ resolver: zodResolver(schema), ...props });
}