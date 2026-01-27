"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator, type BookingStep } from "./step-indicator";
import { ServiceCard } from "./service-card";
import { ResourceCard } from "./resource-card";
import { DatePicker } from "./date-picker";
import { TimeSlotPicker } from "./time-slot-picker";
import { BookingForm } from "./booking-form";
import { BookingSuccess } from "./booking-success";
import { getAvailableTimeSlots, getResourceWorkDays } from "@/hooks/get-data";
import { createBooking } from "@/hooks/booking";
import {
  type Tenant,
  type Service,
  type Resource,
  type TimeSlot,
  type Customer,
} from "@/types/booking";

type ViewState = BookingStep | "success";

interface BookingContainerProps {
  tenant: Tenant;
  services: Service[];
  resources: Resource[];
}

export function BookingContainer({
  tenant,
  services: activeServices,
  resources: activeResources,
}: BookingContainerProps) {
  const [currentStep, setCurrentStep] = useState<ViewState>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  const [bookingCode, setBookingCode] = useState<string>("");

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availableWeekdays, setAvailableWeekdays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchWorkDays() {
      if (selectedResource) {
        try {
          const days = await getResourceWorkDays(selectedResource.id);
          setAvailableWeekdays(days);
        } catch (e) {
          console.error(e);
          setAvailableWeekdays([]);
        }
      } else {
        setAvailableWeekdays([]);
      }
    }
    fetchWorkDays();
  }, [selectedResource]);

  useEffect(() => {
    async function fetchSlots() {
      setAvailableSlots([]);
      setBookedSlots([]);

      if (!selectedResource || !selectedDate || !selectedService) {
        return;
      }

      setIsLoadingSlots(true);
      try {
        const result = await getAvailableTimeSlots(
          selectedDate,
          selectedResource.id,
          selectedService.durationMinutes,
        );

        setAvailableSlots(result.available);
        setBookedSlots(result.booked);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
        setBookedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedResource, selectedDate, selectedService]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (currentStep === "service" && selectedService) {
      setCurrentStep("resource");
    } else if (currentStep === "resource" && selectedResource) {
      setCurrentStep("datetime");
    } else if (currentStep === "datetime" && selectedDate && selectedSlot) {
      setCurrentStep("confirm");
    }
  };

  const handleBack = () => {
    if (currentStep === "resource") {
      setCurrentStep("service");
    } else if (currentStep === "datetime") {
      setCurrentStep("resource");
    } else if (currentStep === "confirm") {
      setCurrentStep("datetime");
    }
  };

  const handleSubmitBooking = async (data: Customer) => {
    if (!selectedService || !selectedResource || !selectedDate || !selectedSlot)
      return;

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        tenantId: tenant.id,
        serviceId: selectedService.id,
        resourceId: selectedResource.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        price: selectedService.price,
        customer: data,
      });

      if (result.success && result.bookingCode) {
        setCustomerData(data);
        setBookingCode(result.bookingCode);
        setCurrentStep("success");
      } else {
        alert("Gagal membuat reservasi. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setCurrentStep("service");
    setSelectedService(null);
    setSelectedResource(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setCustomerData(null);
    setBookingCode("");
  };

  const canContinue = () => {
    if (currentStep === "service" && selectedService) return !!selectedService;
    if (currentStep === "resource" && selectedResource)
      return !!selectedResource;
    if (currentStep === "datetime" && selectedDate && selectedSlot)
      return !!selectedDate && !!selectedSlot;
    return false;
  };

  if (currentStep === "success" && customerData) {
    return (
      <BookingSuccess
        tenant={tenant}
        service={selectedService!}
        resource={selectedResource!}
        date={selectedDate!}
        timeSlot={selectedSlot!}
        customer={customerData}
        bookingCode={bookingCode}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={currentStep as BookingStep} />
      <div className="min-h-100">
        {currentStep === "service" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Pilih Layanan
              </h2>
              <p className="mt-1 text-muted-foreground">
                Pilih layanan yang Anda butuhkan
              </p>
            </div>
            {activeServices.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                Tidak ada layanan tersedia.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedService?.id === service.id}
                    onSelect={handleSelectService}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === "resource" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Pilih Staf</h2>
              <p className="mt-1 text-muted-foreground">
                Pilih staf yang akan melayani Anda
              </p>
            </div>
            {activeResources.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                Tidak ada staf tersedia.
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                {activeResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    selected={selectedResource?.id === resource.id}
                    onSelect={handleSelectResource}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === "datetime" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Pilih Jadwal
              </h2>
              <p className="mt-1 text-muted-foreground">
                Pilih tanggal dan waktu untuk{" "}
                <span className="font-medium text-foreground">
                  {selectedResource?.name}
                </span>
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <DatePicker
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                resourceId={selectedResource?.id ?? null}
                availableWeekdays={availableWeekdays}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Pilih Waktu
                </h3>

                {!selectedDate ? (
                  <div className="flex h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
                    <p className="font-medium text-muted-foreground">
                      Pilih tanggal terlebih dahulu
                    </p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="flex h-75 items-center justify-center rounded-2xl border border-border bg-card">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p>Mengecek ketersediaan...</p>
                    </div>
                  </div>
                ) : (
                  <TimeSlotPicker
                    availableSlots={availableSlots}
                    bookedSlots={bookedSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={handleSelectSlot}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === "confirm" &&
          selectedService &&
          selectedResource &&
          selectedDate &&
          selectedSlot && (
            <div className="space-y-6">
              <BookingForm
                service={selectedService}
                resource={selectedResource}
                date={selectedDate}
                timeSlot={selectedSlot}
                onSubmit={handleSubmitBooking}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
      </div>

      {currentStep !== "confirm" && (
        <div className="flex gap-3">
          {currentStep !== "service" && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="ml-auto gap-2"
          >
            Lanjutkan
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
