export * from "react-hook-form";
import { zodResolver as baseZodResolver } from "@hookform/resolvers/zod";
export const zodResolver: (schema: any, schemaOptions?: any, resolverOptions?: any) => any = baseZodResolver as any;