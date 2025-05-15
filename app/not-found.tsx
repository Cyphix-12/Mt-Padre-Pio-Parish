import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-600 mb-8">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}