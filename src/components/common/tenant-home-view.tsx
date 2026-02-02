"use client";

import { TenantHeader } from "./tenant-header";
import { BookingContainer } from "./booking-container";
import type { Tenant, Service, Resource } from "@/types/booking";

interface TenantHomeViewProps {
  tenant: Tenant;
  services: Service[];
  resources: Resource[];
}

export function TenantHomeView({
  tenant,
  services,
  resources,
}: TenantHomeViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <TenantHeader tenant={tenant} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <BookingContainer
          tenant={tenant}
          services={services}
          resources={resources}
        />
      </main>
      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {tenant.name}. Sistem Reservasi
            Online.
          </p>
        </div>
      </footer>
    </div>
  );
}
