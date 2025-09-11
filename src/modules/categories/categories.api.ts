import { Category } from "./categories.schema";
import { getUrl } from "utils/getUrl";

const postCategory = async (newCategory: Category) => {
  const url = getUrl("api/categories");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCategory),
  });

  if (response.status !== 201) {
    throw new Error(response.status + " " + response.statusText);
  }

  const savedCategory = await response.json();

  return savedCategory;
};

const getCategoryByIdOrSlug = async (idOrSlug: string) => {
  const response = await fetch(getUrl("api/categories/" + idOrSlug));
  const category = await response.json();
  return category;
};
const updateCategoryByIdOrSlug = async (category: Category, id: string) => {
  const { slug } = category;
  const response = await fetch(getUrl("api/categories/" + id || slug), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  const updatedCategory = await response.json();
  return updatedCategory;
};

export async function getAllCategories() {
  try {
    const response = await fetch(getUrl("api/categories"));
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function deleteCategory(slug: string) {
  const response = await fetch(getUrl("api/categories/" + slug), {
    method: "DELETE",
  });
  return response;
}

export { postCategory, getCategoryByIdOrSlug, updateCategoryByIdOrSlug };
