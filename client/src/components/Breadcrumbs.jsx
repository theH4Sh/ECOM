import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useBreadcrumbContext } from "../context/BreadcrumbContext";

const ROUTE_LABELS = {
  login: "Login",
  signup: "Sign Up",
  orders: "Order History",
  checkout: "Checkout",
  shipping: "Shipping & Returns",
  faq: "FAQ",
  contact: "Contact",
  search: "Search",
  "forgot-password": "Forgot Password",
};

const ADMIN_LABELS = {
  admin: "Dashboard",
  products: "Products",
  orders: "Orders",
};

const capitalize = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const Chevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 text-gray-300 shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-.02Z"
      clipRule="evenodd"
    />
  </svg>
);

const buildStoreCrumbs = (pathname, searchParams, dynamicLabel) => {
  if (pathname === "/") return [];

  const crumbs = [{ label: "Home", to: "/" }];
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "product" && segments[1]) {
    crumbs.push({
      label: dynamicLabel || "Product",
      to: pathname,
    });
    return crumbs;
  }

  if (segments[0] === "category" && segments[1]) {
    crumbs.push({
      label: `${capitalize(segments[1])} Products`,
      to: pathname,
    });
    return crumbs;
  }

  if (segments[0] === "search") {
    crumbs.push({ label: "Search", to: "/search" });
    const query = searchParams.get("q");
    if (query) {
      const queryString = searchParams.toString();
      crumbs.push({
        label: `"${query}"`,
        to: queryString ? `${pathname}?${queryString}` : pathname,
      });
    }
    return crumbs;
  }

  if (segments[0] === "reset-password") {
    crumbs.push({ label: "Reset Password", to: pathname });
    return crumbs;
  }

  const label = ROUTE_LABELS[segments[0]] || capitalize(segments[0]);
  crumbs.push({ label, to: pathname });
  return crumbs;
};

const buildAdminCrumbs = (pathname) => {
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Admin", to: "/admin" },
  ];

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1) {
    crumbs.push({ label: "Dashboard", to: "/admin" });
    return crumbs;
  }

  const section = segments[1];
  const label = ADMIN_LABELS[section] || capitalize(section);
  crumbs.push({ label, to: pathname });
  return crumbs;
};

export default function Breadcrumbs({ variant = "store" }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { dynamicLabel } = useBreadcrumbContext();

  const crumbs =
    variant === "admin"
      ? buildAdminCrumbs(location.pathname)
      : buildStoreCrumbs(location.pathname, searchParams, dynamicLabel);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        variant === "admin"
          ? "mb-6"
          : "max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-4"
      }
    >
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.to}-${index}`} className="flex items-center gap-1.5 min-w-0">
              {index > 0 && <Chevron />}
              {isLast ? (
                <span className="font-medium text-gray-900 truncate max-w-[12rem] sm:max-w-xs">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="hover:text-[#0B7C56] transition truncate max-w-[8rem] sm:max-w-none"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
