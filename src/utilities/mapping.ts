import { formatMediaUrl } from "@/utilities/media-url-format";
import type { Tenant, Service, Resource } from "@/types/booking";

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

export const mappingTenant = (data: any): Tenant => ({
  id: String(data.id),
  name: data.name,
  domain: data.domain,
  logo: formatMediaUrl(data.logo) || "/placeholder.png",
  description: data.description || `Selamat datang di ${data.name}`,
  address: data.address || "",
  phone: data.phone || "",
  email: data.email || "",
  businessType: "other",
  operatingHours: (data.operatingHours || []).map((h: any) => ({
    dayOfWeek: parseInt(h.dayOfWeek),
    open: h.open || "",
    close: h.close || "",
    isClosed: h.isClosed || false,
  })),
});