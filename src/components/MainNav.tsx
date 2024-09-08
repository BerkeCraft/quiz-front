import { Link, NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <NavLink
        to="/dashboard/all"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary aria-[current=page]:text-primary"
      >
        All Quizzes
      </NavLink>
      <NavLink
        to="/dashboard/my-quizzes"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary aria-[current=page]:text-primary"
      >
        My Quizzes
      </NavLink>
      <Link
        to={"#"}
        aria-disabled
        className="text-sm max-md:hidden font-medium opacity-50  text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  );
}
