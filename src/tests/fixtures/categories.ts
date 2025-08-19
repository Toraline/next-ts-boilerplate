import { errorMessages } from "constants/errors";

export const categoryComplete = {
  name: "Category Complete",
  slug: "category_complete",
  description: "Description for Category Complete",
};

export const categoryRequiredData = {
  name: "Category required data",
  slug: "category_required",
};

export const categories = [categoryComplete, categoryRequiredData];

export const missingSlugError = {
  error: errorMessages.VALIDATION_ERROR,
  issues: {
    slug: {
      errors: [errorMessages.SLUG_TYPE_ERROR],
    },
  },
};

export const emptySlugError = {
  error: errorMessages.VALIDATION_ERROR,
  issues: {
    slug: {
      errors: [errorMessages.SLUG_EMPTY_ERROR],
    },
  },
};

export const missingNameError = {
  error: errorMessages.VALIDATION_ERROR,
  issues: {
    name: {
      errors: [errorMessages.NAME_TYPE_ERROR],
    },
  },
};

export const emptyNameError = {
  error: errorMessages.VALIDATION_ERROR,
  issues: {
    name: {
      errors: [errorMessages.NAME_EMPTY_ERROR],
    },
  },
};
