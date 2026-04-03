"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError
} from "@/components/ui/field"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"


import { createProductFormSchema, CreateProductFormType } from "@/lib/schemas/products"
import { Category, Product } from "@/drizzle/schema"
import { updateProduct } from "@/actions/products/products"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategorySwitcher } from "./select-category"
import { ImageUpload } from "@/components/uplaodthing/image-upload"
import { Loader2Icon } from "lucide-react"
import { LoadingSwap } from "@/components/ui/loading-swap"

type Props = {
  category: Category[] | null
  product: Product
  onSuccess?: () => void
}

export function UpdateProductForm({ category, product, onSuccess }: Props) {

  const form = useForm<CreateProductFormType>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: product.name ?? "",
      categoryId: product.categoryId ?? "",
      description: product.description ?? "",
      price: product.price?.toString() ?? "",
      favorite: product.favorite ?? false,
    }
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: CreateProductFormType) {
    try {
      const result = await updateProduct({
        id: product.id,
        ...values,
      })

      if (result.success) {
        toast.success(`${product.name} mis à jour avec succès`)
        onSuccess?.()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  return (
    <DialogContent className="px-10">
      <DialogHeader>
        <DialogTitle>Nouveau produit</DialogTitle>
        <DialogDescription>
          Remplir le formulaire ci-dessous pour créer un nouveau produit.
        </DialogDescription>
      </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-6xl py-4">
          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Field className="space-y-1">
                <FieldLabel htmlFor="name">Nom du produit</FieldLabel>
                <Input 
                  id="name" 
                  placeholder="shadcn"
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="categoryId">Catégorie</FieldLabel>
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <CategorySwitcher
                      categories={(category ?? []).map((c) => ({
                        id: c.id,
                        name: c.name,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FieldError>
                  {form.formState.errors.categoryId?.message}
                </FieldError>
              </Field>
            </div>
            <Field>
              <FieldLabel>Image</FieldLabel>
              <ImageUpload
                value={form.watch("imageUrl")}
                onChange={(url) =>
                  form.setValue("imageUrl", url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
              <FieldError>{form.formState.errors.imageUrl?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea 
                id="description" 
                placeholder="Placeholder"
                
                {...form.register("description")}
              />
              <FieldError>{form.formState.errors.description?.message}</FieldError>
            </Field>
          <Field>
            <FieldLabel htmlFor="price">Prix</FieldLabel>
            <Input 
              id="price" 
              placeholder="5.00"
              
              {...form.register("price")}
            />
            <FieldError>{form.formState.errors.price?.message}</FieldError>
          </Field>
          <Field>
            <div className="w-full flex items-center gap-2">
              <Checkbox 
                className="border-primary"
                id="favorite"
                checked={form.watch("favorite")}
                onCheckedChange={(checked) => 
                  form.setValue("favorite", !!checked, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            <FieldLabel htmlFor="favorite">Produit vedette</FieldLabel>
            </div>
          </Field>
        </div>
        <DialogFooter>
          <div  className="w-full flex items-center gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => form.reset()}>Réinitialiser</Button>
            <Button type="submit" disabled={isLoading} size="sm">
              <LoadingSwap isLoading={isLoading} >Mettre à jour</LoadingSwap>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}