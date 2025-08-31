"use client"

import { useTenantCategories } from "@/hooks/use-tenant-categories"
import { CategoriesTable } from "@/components/tenant/categories-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Categories</h1>
            <p className="text-gray-600 mt-1">Manage your property categories</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

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