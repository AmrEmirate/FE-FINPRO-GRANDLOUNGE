"use client"

import { useTenantCategories } from "@/hooks/use-tenant-categories"
import { CategoriesTable } from "@/components/tenant/categories-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoriesPageHeader } from "@/components/tenant/categories-page-header" // Import komponen baru

export default function TenantCategoriesPage() {
  const {
    categories,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTenantCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoriesPageHeader onAddCategory={() => setIsDialogOpen(true)} />

        <Card>
          <CardHeader>
            <CardTitle>Category List</CardTitle>
            <CardDescription>A list of all your property categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesTable
              categories={categories}
              isLoading={isLoading}
              onEdit={handleUpdate}
              onDelete={handleDelete}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onCreate={handleCreate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}