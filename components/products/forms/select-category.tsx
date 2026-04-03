"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CategoryForSelect } from "./add-product-form"
import { Input } from "@/components/ui/input"
import { createCategory } from "@/actions/products/products"
import { useMutation } from "@/hooks/use-mutations"

export function CategorySwitcher({
  categories,
  value,
  onChange,
}: {
  categories: CategoryForSelect[]
  value?: string
  onChange: (value: string) => void
}) {
  const selectedCategory = categories.find((c) => c.id === value)

  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const { mutate: mutateCreateCategory, isLoading } = useMutation(createCategory, {
    successMessage: "Catégorie créée avec succès",
    onSuccess: () => {
      setDialogOpen(false)
      setNewCategoryName("")
    },
  })


  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleAddCategory() {
    mutateCreateCategory({ name: newCategoryName })
  }
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            {selectedCategory?.name ?? "Choisir une catégorie"}
            <ChevronsUpDown className="ml-auto size-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Rechercher..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => {
                    onChange(category.id)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  {category.name}
                  {value === category.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
                <CommandItem
                  className="text-blue-600 font-medium"
                  onSelect={() => setDialogOpen(true)}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Ajouter une catégorie
                </CommandItem>          
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleAddCategory} disabled={isLoading || newCategoryName.trim().length === 0}>
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

