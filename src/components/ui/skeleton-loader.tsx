import { cn } from "@/lib/utils";

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SkeletonLoader({ className, ...props }: SkeletonLoaderProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-gray-200",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-50/50 to-transparent" />
        </div>
    );
}