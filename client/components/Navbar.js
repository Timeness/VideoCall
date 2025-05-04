import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 shadow-lg">
      <div className="container flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
            ConnectSphere
          </span>
        </Link>
        <div>
          <Link href="/" className="px-4 py-2 text-white hover:text-blue-200 transition">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
