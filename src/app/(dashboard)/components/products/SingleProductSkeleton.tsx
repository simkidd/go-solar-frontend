"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SingleProductSkeleton = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-24 rounded-lg" />
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      <Card className="dark:bg-[#222327] mb-8 shadow-sm border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            {/* Product Images */}
            <div className="w-full">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="mt-8">
                <Skeleton className="h-10 w-48 rounded-lg" />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full flex flex-col space-y-6">
              <Skeleton className="h-10 w-64 rounded-lg" />

              {/* Price Section */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>

              {/* Offer Banner */}
              <Skeleton className="h-20 w-full rounded-2xl" />

              {/* Product Metadata */}
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-32 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SingleProductSkeleton;
