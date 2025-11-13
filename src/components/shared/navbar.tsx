import { Link, useLocation } from "@tanstack/react-router";
import ThemeToggle from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const isActive = (to: string) => location.pathname === to;

  return (
    <nav className="mx-auto w-full max-w-400 px-25 pt-10">
      <div className="flex items-center justify-between">
        <span className="text-3xl">Just an Accounting Generator</span>
        <ThemeToggle />
      </div>
      <div className="flex gap-6 border-text border-b-2">
        <NavbarLink isActive={isActive("/")} to="/">
          Overview
        </NavbarLink>
        <NavbarLink isActive={isActive("/quotation")} to="/quotation">
          Quotation
        </NavbarLink>
        <NavbarLink isActive={isActive("/invoice")} to="/invoice">
          Invoice
        </NavbarLink>
      </div>
    </nav>
  );
}

function NavbarLink({
  children,
  to,
  isActive,
}: {
  children: React.ReactNode;
  to: string;
  isActive: boolean;
}) {
  return (
    <Link
      className={cn(
        "py-2 text-xl underline-offset-15 transition-all duration-150 ease-in-out hover:text-primary hover:underline",
        isActive && "text-primary underline"
      )}
      to={to}
    >
      {children}
    </Link>
  );
}
