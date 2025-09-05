import { Category } from "modules/categories";
import Link from "next/link";

type CategoriesTableProps = {
  categories: Category[];
  loading: boolean;
};

export default function CategoriesTable({ categories, loading }: CategoriesTableProps) {
  return (
    <ul>
      {loading && "is loading..."}
      {categories.length && "No categories found"}
      {!loading &&
        categories.length > 0 &&
        categories.map((category) => (
          <li key={category.slug}>
            <p> {category.name}</p>
            <p> {category.slug}</p>
            <p>{category.description}</p>
            <Link href={`/categories/${category.slug}`}>Edit Category</Link>
          </li>
        ))}
    </ul>
  );
}
