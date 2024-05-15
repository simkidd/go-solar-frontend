import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full font-inter py-20 pt-10 min-h-[50vh]">
      <div className="container mx-auto px-2 mb-8 flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-medium mb-8">Not Found</h2>
        <p className="mb-4">Could not find requested resource</p>
        <Link href="/shop" className="bg-primary text-white px-6 py-2">Return to Shop</Link>
      </div>
    </div>
  );
}
