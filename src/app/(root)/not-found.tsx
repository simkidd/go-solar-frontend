import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="font-inter pb-20 flex items-center justify-center w-full min-h-dvh flex-col">
      <PageHeader
        heading="Oops!"
        className="text-white bg-search-bg bg-no-repeat bg-center bg-cover grayscale"
      />
      <div className="container mx-auto px-2 mb-8 flex items-center justify-center flex-col pt-20">
        <h2 className="text-3xl font-medium mb-8">Not Found</h2>
        <p className="mb-4">Could not find requested resource</p>
        <Link href="/" className="bg-primary text-white px-6 py-2">Go home</Link>
      </div>
    </div>
  );
}
