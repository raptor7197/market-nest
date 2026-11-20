import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center bg-offwhite px-4 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-burnt-50 text-burnt">
      <ShieldAlert className="h-8 w-8" />
    </div>
    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-charcoal">
      Access denied
    </h1>
    <p className="mt-3 max-w-md text-sm text-gray-500">
      Your account does not have permission to view this page.
    </p>
    <Link
      to="/products"
      className="mt-6 rounded-full bg-burnt px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(201,79,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-burnt-600"
    >
      Back to marketplace
    </Link>
  </div>
);

export default Unauthorized;
