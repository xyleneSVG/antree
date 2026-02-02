import type { FieldHook } from "payload";
import { ValidationError } from "payload";

export const ensureUniqueTenantName: FieldHook = async ({
  originalDoc,
  req,
  value,
}) => {
  if (!value) {
    return value;
  }

  if (originalDoc?.name === value) {
    return value;
  }

  const findDuplicateTenants = await req.payload.find({
    collection: "tenants",
    where: {
      name: {
        equals: value,
      },
    },
  });

  if (findDuplicateTenants.totalDocs > 0) {
    throw new ValidationError({
      errors: [
        {
          message: `The name "${value}" is already taken by another tenant. Please use a unique name.`,
          path: "name",
        },
      ],
    });
  }

  return value;
};
