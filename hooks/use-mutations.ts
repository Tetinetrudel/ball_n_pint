"use client"

import { useState } from "react"
import { toast } from "sonner"

type MutationFn<TArgs extends any[], TData> = (
  ...args: TArgs
) => Promise<
  | { success: true; data: TData }
  | { success: false; message: string }
>

type Options<TData> = {
  onSuccess?: (data: TData) => void
  onError?: (message: string) => void
  successMessage?: string
}

export function useMutation<TArgs extends any[], TData>(
  fn: MutationFn<TArgs, TData>,
  options?: Options<TData>
) {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = async (...args: TArgs) => {
    setIsLoading(true)

    const result = await fn(...args)

    setIsLoading(false)

    if (!result.success) {
      toast.error(result.message)
      options?.onError?.(result.message)
      return null
    }

    if (options?.successMessage) {
      toast.success(options.successMessage)
    }

    options?.onSuccess?.(result.data)

    return result.data
  }

  return {
    mutate,
    isLoading,
  }
}