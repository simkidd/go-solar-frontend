import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className=" p-8  text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          401 - Unauthorized
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mb-6">
          You do not have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}