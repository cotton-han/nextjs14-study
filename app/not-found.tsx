import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-3 min-h-screen justify-center items-center">
      <h2 className="text-4xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
