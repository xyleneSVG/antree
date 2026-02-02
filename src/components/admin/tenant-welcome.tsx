"use client";

import React from "react";
import { useTenantSelection } from "@payloadcms/plugin-multi-tenant/client";

export function TenantWelcome() {
  const { selectedTenantID, options } = useTenantSelection();

  const currentTenant = options.find((t) => t.value === selectedTenantID);

  if (!selectedTenantID) {
    return (
      <div
        style={{
          backgroundColor: "#f3f4f6",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "24px" }}>🌍</div>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
            Global Dashboard
          </h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
            Anda sedang melihat data gabungan dari semua klinik. Pilih tenant di
            menu untuk filter data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#ecfdf5",
        border: "1px solid #6ee7b7",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div style={{ fontSize: "24px" }}>🏥</div>
      <div>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#065f46" }}>
          {typeof currentTenant?.label === "string"
            ? currentTenant.label
            : "Tenant Active"}
        </h2>
        <p style={{ margin: "4px 0 0", color: "#047857" }}>
          Mode manajemen aktif. Semua data yang ditampilkan khusus untuk klinik
          ini.
        </p>
      </div>
    </div>
  );
}
