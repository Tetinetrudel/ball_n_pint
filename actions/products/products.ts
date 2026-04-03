"use server"

import { db } from "@/drizzle/db/db";
import { categories, Category, products, ProductWithRelations } from "@/drizzle/schema";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission, requireUserContext, safeAction } from "@/lib/helpers";
import { normalizeText } from "@/lib/utils/normalize-text";
import { CreateCategoryInput, CreateProductInput, UpdateProductInput } from "@/lib/types/products";

export async function createCategory(data: CreateCategoryInput) {
  return safeAction(async () => {
    const { org } = await requirePermission("products.manage")
    const normalizedName = normalizeText(data.name)

    const categoriesList = await db.query.categories.findMany({
      where: eq(categories.organizationId, org.id),
    })

    const exists = categoriesList.some(
      (c) => normalizeText(c.name) === normalizedName
    )

    if (exists) {
      throw new Error(`${data.name} existe déjà`)
    }

    const [newCat] = await db
      .insert(categories)
      .values({
        name: data.name,
        organizationId: org.id,
      })
      .returning()

    revalidatePath(`/organization/${org.id}/products`)
    return newCat
  }, {
    errorMessage: "Erreur lors de la création de la catégorie",
  })
}

export async function createProduct(data: CreateProductInput) {
  return safeAction(async () => {
    const { org } = await requirePermission("products.manage")

    if (!data.name || !data.price || !data.categoryId) {
      throw new Error("Champs requis manquants")
    }

    const normalizedName = normalizeText(data.name)

    const existingProduct = await db.query.products.findFirst({
      where: and(
        eq(sql`LOWER(${products.name})`, normalizedName),
        eq(products.organizationId, org.id)
      )
    })

    if (existingProduct) {
      throw new Error(`${existingProduct.name} existe déjà`)
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        price: data.price,
        favorite: data.favorite,
        organizationId: org.id,
        stock: 100,
        imageUrl: data.imageUrl ?? null
      })
      .returning()

    revalidatePath(`/organization/${org.id}/products`)
    return newProduct
  }, {
    errorMessage: "Erreur lors de la création du produit",
  })
}

export async function getCategory(): Promise<Category[]> {
  try {
    const { org } = await requireUserContext()
    const category = await db.query.categories.findMany({
      where: eq(categories.organizationId, org.id)
    });

    if (category.length === 0) {
      return [];
    }

    return category;
  } catch (error) {
    console.error("Erreur getCategory:", error);
    return [];
  }
}

export async function getProducts(): Promise<ProductWithRelations[]> {
  try {
    const { org } = await requireUserContext()
    const allProducts = await db.query.products.findMany({
      where: eq(products.organizationId, org.id),
      with: {
        category: {
          columns: { id: true, name: true },
        },
      },
      orderBy: [desc(products.createdAt)],
    });
    if(allProducts.length === 0) return []

    return allProducts
  } catch (error) {
    console.error("Échec récupération produits:", error);
    return [];
  }
}

export async function updateProduct( data: UpdateProductInput) {
  return safeAction(async () => {
    const { org } = await requirePermission("products.manage")
    const { id, ...updateFields } = data

    if (!id) {
      throw new Error("ID du produit requis")
    }

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("Aucun champ à mettre à jour")
    }

    const [updatedProduct] = await db
      .update(products)
      .set({
        ...fieldsToUpdate,
      })
      .where(
        and(
          eq(products.id, id),
          eq(products.organizationId, org.id) 
        )
      )
      .returning()

    if (!updatedProduct) {
      throw new Error("Produit non trouvé ou accès non autorisé")
    }

    revalidatePath(`/organization/${org.id}/products`)
    return updatedProduct
  }, {
    errorMessage: "Erreur lors de la mise à jour du produit",
  })
}

export async function deleteProduct(id: string) {
  return safeAction(async () => {
    const { org } = await requirePermission("products.manage")
    const deleted = await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.organizationId, org.id)))
      .returning()

    if (!deleted.length) {
      throw new Error("Produit non trouvé ou accès refusé")
    }

    revalidatePath(`/organization/${org.id}/products`)
    return deleted[0]
  }, {
    errorMessage: "Erreur lors de la suppression",
  })
}
