import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-burnt">404</p>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-charcoal">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(201,79,36,0.24)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
