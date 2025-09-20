import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { ChevronLeft } from "lucide-react";

export default function PropertyDetailLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 inline-flex items-center text-gray-400">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Properties
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[450px]">
                            <div className="col-span-3 row-span-2">
                                <SkeletonLoader className="w-full h-full" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SkeletonLoader className="h-8 w-3/4" />
                            <SkeletonLoader className="h-6 w-1/2" />
                            <SkeletonLoader className="h-5 w-full mt-2" />
                            <SkeletonLoader className="h-5 w-full" />
                            <SkeletonLoader className="h-5 w-5/6" />
                        </div>

                        <SkeletonLoader className="h-96 w-full" />
                    </div>

                    <div className="lg:col-span-1 sticky top-24">
                        <div className="p-6 border rounded-lg space-y-4">
                            <SkeletonLoader className="h-7 w-1/3" />
                            <SkeletonLoader className="h-10 w-full" />
                            <SkeletonLoader className="h-10 w-full" />
                            <SkeletonLoader className="h-12 w-full mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}