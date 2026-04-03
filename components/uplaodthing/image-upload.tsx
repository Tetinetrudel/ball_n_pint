"use client"

import { useCallback, useState } from "react"
import { Upload, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing/uploadthing"
import { cn } from "@/lib/utils"

type Props = {
  value?: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(value ?? null)

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        onChange(res[0].url)
        setPreview(res[0].url)
      }
    },
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)

      await startUpload([file])
    },
    [startUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  })

  const removeImage = () => {
    setPreview(null)
    onChange("") // ou null selon ton schema
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Preview */}
      {preview ? (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-6 cursor-pointer transition",
            isDragActive
              ? "border-primary bg-muted"
              : "border-muted-foreground/25"
          )}
        >
          <input {...getInputProps()} />

          <Upload className="w-6 h-6 text-muted-foreground" />

          <p className="text-sm text-muted-foreground">
            {isUploading
              ? "Upload en cours..."
              : isDragActive
              ? "Dépose ton image ici"
              : "Glisse une image ou clique"}
          </p>
        </div>
      )}
    </div>
  )
}