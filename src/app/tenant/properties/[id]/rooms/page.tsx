"use client"

import { useParams } from "next/navigation"
import { useTenantRooms } from "@/hooks/use-tenant-rooms"
import { RoomsTable } from "@/components/tenant/rooms-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TenantRoomsPage() {
  const params = useParams()
  const propertyId = params.id as string
  const {
    rooms,
    isLoading,
    propertyName,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTenantRooms(propertyId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/tenant/properties" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
              <p className="text-gray-600 mt-1">Property: {propertyName || "Loading..."}</p>
            </div>
            {/* Tombol Add Room sekarang akan ditangani di dalam RoomsTable */}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room List</CardTitle>
            <CardDescription>A list of all rooms in this property.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Hapus isDialogOpen dan setIsDialogOpen dari sini */}
            <RoomsTable
              propertyId={propertyId}
              rooms={rooms}
              isLoading={isLoading}
              onEdit={handleUpdate}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}