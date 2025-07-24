import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  to: string;
};

function NavItem({ children, to }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "rounded-md bg-gray-200" : "")}
    >
      {children}
    </NavLink>
  );
}

export default NavItem;
