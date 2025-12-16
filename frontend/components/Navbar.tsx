import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Regear App</Link>
        <div className="space-x-4">
          <Link href="/members" className="hover:text-gray-300">Members</Link>
          <Link href="/prices" className="hover:text-gray-300">Prices</Link>
        </div>
      </div>
    </nav>
  );
}
