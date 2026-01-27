"use client";

import React, { useState } from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { updateBookingStatus, deleteBooking } from "../hooks/update";

export function BookingActions() {
  const { id } = useDocumentInfo();
  const [isLoading, setIsLoading] = useState(false);

  const statusField = useFormFields(([fields]) => fields.status);
  const currentStatus = statusField?.value as string;

  if (!id) return null;

  const handleUpdate = async () => {
    const isConfirmed = confirm(
      "Apakah Anda yakin ingin menerima booking ini?",
    );
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const res = await updateBookingStatus(id.toString(), "confirmed");
      if (res.success) {
        window.location.reload();
      } else {
        alert("Gagal mengupdate status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (action: "reject" | "complete") => {
    const message =
      action === "reject"
        ? "Tolak booking? Data akan dihapus permanen."
        : "Selesaikan booking? Data akan dihapus dari sistem.";

    const isConfirmed = confirm(message);
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const res = await deleteBooking(id.toString());
      if (res.success) {
        window.location.href = "/admin/collections/bookings";
      } else {
        alert("Gagal menghapus booking");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="field-type"
      style={{
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <label className="field-label">Quick Actions</label>

      {currentStatus === "pending" && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isLoading}
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              padding: "12px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            {isLoading ? "..." : "✅ Accept"}
          </button>

          <button
            type="button"
            onClick={() => handleDelete("reject")}
            disabled={isLoading}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "12px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            {isLoading ? "..." : "❌ Reject (Delete)"}
          </button>
        </div>
      )}

      {currentStatus === "confirmed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              padding: "10px",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Status: Confirmed
          </div>

          <button
            type="button"
            onClick={() => handleDelete("complete")}
            disabled={isLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            {isLoading ? "..." : "🏁 Tandai sudah selesai"}
          </button>
        </div>
      )}
    </div>
  );
}
