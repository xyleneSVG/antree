import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Storage",
  },
  access: {
    read: () => true,
  },
  fields: [],
  upload: true,
};
