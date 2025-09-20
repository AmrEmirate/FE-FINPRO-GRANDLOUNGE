// src/components/properties/filters-skeleton.tsx

// TAMBAHKAN "export default" di sini
export default function FiltersSkeleton() {
  return (
    <div className="hidden md:block w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}