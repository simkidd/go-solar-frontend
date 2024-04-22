import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full font-inter py-20 pt-10">
      <div className="container mx-auto px-2 mb-8 flex flex-col items-center">
        <h2 className="text-3xl font-medium">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
