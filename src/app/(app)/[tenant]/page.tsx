import { notFound } from "next/navigation";
import { TenantHomeView } from "@/components/common/tenant-home-view";
import {
  getTenantByDomain,
  getServices,
  getResources,
} from "@/hooks/get-data";
import {
  mappingTenant,
  mappingService,
  mappingResource,
} from '@/utilities/mapping';

export default async function TenantHomePage({
  params: paramsPromise,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const params = await paramsPromise;
  const domain = params.tenant.trim().split(":")[0];

  const tenantData = await getTenantByDomain(domain);

  if (!tenantData) {
    return notFound();
  }

  const tenantIdString = String(tenantData.id);

  const [rawServices, rawResources] = await Promise.all([
    getServices(tenantIdString),
    getResources(tenantIdString),
  ]);

  const formattedTenant = mappingTenant(tenantData);
  const formattedServices = rawServices.map(mappingService);
  const formattedResources = rawResources.map(mappingResource);

  return (
    <TenantHomeView
      tenant={formattedTenant}
      services={formattedServices}
      resources={formattedResources}
    />
  );
}