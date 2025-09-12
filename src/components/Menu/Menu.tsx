import Link from "next/link";
import "./Menu.style.css";

export const Menu = () => {
  const categories = [
    {
      name: "Family",
    },
    {
      name: "Personal",
    },
    {
      name: "Study",
    },
    {
      name: "Work",
    },
  ];
  //   const pathname = usePathname();
  return (
    <div className="menu">
      {categories.map((categories) => (
        <Link className="menu__item" href="/categories/Family">
          {categories.name}
        </Link>
      ))}
    </div>
  );
};
