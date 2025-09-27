
import { Suspense } from "react";
import { PropertyFilters } from "@/components/properties/property-filters";
import { SearchHeader } from "@/components/properties/search-header";
import { PropertiesGrid } from "@/components/properties/properties-grid";
import { getProperties } from "@/services/propertyService"; 
import PropertiesLoading from "./loading";

async function PropertiesContent({ searchParams }: { searchParams: { [key:string]: any }}) {
  const { data: properties, meta } = await getProperties(searchParams);

  return (
    <>
      <Suspense fallback={<div>Loading header...</div>}>
        <SearchHeader propertiesCount={meta.total} />
      </Suspense>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-80 md:flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <Suspense fallback={<div>Loading filters...</div>}>
                <PropertyFilters />
              </Suspense>
            </div>
          </aside>
          <main className="flex-1">
            <PropertiesGrid
              properties={properties || []}
              currentPage={meta.page}
              totalPages={meta.totalPages}
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default function PropertiesPage({ searchParams }: { searchParams: { [key: string]: any }}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}