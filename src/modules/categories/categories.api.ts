import { Category } from "./categories.schema";

const postCategory = async (newCategory: Category) => {
  const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + "/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCategory),
  });
  const savedCategory = await response.json();
  return savedCategory;
};

const getCategoryByIdOrSlug = async (idOrSlug: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + "/api/categories/" + idOrSlug);
  const category = await response.json();
  return category;
};
const updateCategoryByIdOrSlug = async (category: Category, id: string) => {
  const { slug } = category;
  const response = await fetch(
    process.env.NEXT_PUBLIC_VERCEL_URL + "/api/categories/" + id || slug,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    },
  );
  const updatedCategory = await response.json();
  return updatedCategory;
};

export async function getAllCategories() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + "/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function deleteCategory(slug: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + "/api/categories/" + slug, {
    method: "DELETE",
  });
  return response;
}

export { postCategory, getCategoryByIdOrSlug, updateCategoryByIdOrSlug };
