import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
import { Category } from "../models/Category";
import { ApiReferenceReact } from "@scalar/api-reference-react";

export default async function Page() {
  const spec = await generateOpenApiSpec({
    Category,
  });
  return (
    <body>
      <h1>My public Page</h1>
      <ApiReferenceReact spec={spec}></ApiReferenceReact>;
    </body>
  );
}
