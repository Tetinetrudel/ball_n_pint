import { ActionResult } from "@/lib/types/actions"

export type MutationFn<TArgs extends any[], TData> = (
  ...args: TArgs
) => Promise<ActionResult<TData>>

export type MutationOptions<TData> = {
  onSuccess?: (data: TData) => void
  onError?: (message: string) => void
  successMessage?: string
}
