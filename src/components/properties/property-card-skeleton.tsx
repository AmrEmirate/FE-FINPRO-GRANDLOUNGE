// src/components/properties/property-card-skeleton.tsx

// TAMBAHKAN "export default" di sini
export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}