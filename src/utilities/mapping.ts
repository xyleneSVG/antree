import { formatMediaUrl } from "@/utilities/media-url-format";

import type {
  Tenant as BookingTenant,
  Service,
  Resource,
} from "@/types/booking";
import type { Tenant as PayloadTenant } from "@/payload-types";

const getRelationId = (relation: any): string => {
  return typeof relation === "object" && relation?.id
    ? String(relation.id)
    : String(relation);
};

export const mappingService = (s: any): Service => ({
  id: String(s.id),
  tenantId: getRelationId(s.tenant),
  name: s.name,
  description: s.description || "",
  durationMinutes: s.durationMinutes || 30,
  price: s.price,
  isActive: s.isActive ?? true,
  category: typeof s.category === "string" ? s.category : "Umum",
});

export const mappingResource = (r: any): Resource => ({
  id: String(r.id),
  tenantId: getRelationId(r.tenant),
  name: r.name,
  specialty: r.specialty || "Staf",
  isActive: r.isActive ?? true,
  avatar: formatMediaUrl(r.avatar) || "/avatars/default.jpg",
});

export const mappingTenant = (data: PayloadTenant): BookingTenant => ({
  id: String(data.id),
  name: data.name,
  domain: data.domain,

  logo:
    data.logo && typeof data.logo !== "number"
      ? formatMediaUrl(data.logo) || "/placeholder.png"
      : "/placeholder.png",

  description: data.description || `Selamat datang di ${data.name}`,
  accentColor: data.accentColor || "#000000",
  address: data.address || "",
  phone: data.phone || "",
  email: data.email || "",
  operatingHours: (data.operatingHours || []).map((h: any) => ({
    dayOfWeek: parseInt(h.dayOfWeek),
    open: h.open || "",
    close: h.close || "",
    isClosed: h.isClosed || false,
  })),
});
