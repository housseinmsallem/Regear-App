import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-8">Welcome to Regear App</h1>
      <p className="mb-12 text-gray-600">Manage your guild Members and Item Prices efficiently.</p>
      
      <div className="flex justify-center space-x-8">
        <Link href="/members" className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Manage Members
        </Link>
        <Link href="/prices" className="px-8 py-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
          Manage Prices
        </Link>
      </div>
    </div>
  );
}
