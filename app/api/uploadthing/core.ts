import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const uploadRouter = {
  productImage: f({
    image: { maxFileSize: "2MB" },
  }).onUploadComplete(async ({ file }) => {
    return {
      url: file.url,
    }
  }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
