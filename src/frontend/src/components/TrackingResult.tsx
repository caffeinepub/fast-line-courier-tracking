import {
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type { Shipment } from "../backend.d";

const STEPS = [
  { label: "Order Placed", key: "placed" },
  { label: "In Transit", key: "transit" },
  { label: "Out for Delivery", key: "out" },
  { label: "Delivered", key: "delivered" },
];

function getStepIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("deliver") && !s.includes("out")) return 3;
  if (s.includes("out")) return 2;
  if (s.includes("transit") || s.includes("shipped")) return 1;
  return 0;
}

function InfoCard({
  title,
  fields,
}: {
  title: string;
  fields: { icon: React.ReactNode; label: string; value: string }[];
}) {
  return (
    <div className="rounded-lg overflow-hidden shadow-card border border-border">
      <div
        className="px-5 py-3"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.18 0.04 240), oklch(0.22 0.055 240))",
        }}
      >
        <h3 className="text-white font-semibold text-sm tracking-wide">
          {title}
        </h3>
      </div>
      <div className="bg-white p-5 space-y-3">
        {fields.map((f) => (
          <div key={f.label} className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {f.label}
              </p>
              <p className="text-sm font-semibold text-foreground">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrackingResult({ shipment }: { shipment: Shipment }) {
  const stepIndex = getStepIndex(shipment.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
      data-ocid="tracking.panel"
    >
      {/* Tracking Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
          Shipment Details For
        </p>
        <h2
          className="font-display font-bold text-2xl sm:text-3xl"
          style={{ color: "oklch(0.18 0.04 240)" }}
        >
          #{shipment.trackingNumber}
        </h2>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-xl shadow-card border border-border p-6 mb-6">
        <div className="relative flex items-center justify-between">
          <div
            className="absolute top-5 left-0 right-0 h-0.5"
            style={{ background: "oklch(0.9 0.01 240)" }}
          />
          <div
            className="absolute top-5 left-0 h-0.5 transition-all duration-700"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.13 75), oklch(0.62 0.12 75))",
              width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className="relative flex flex-col items-center z-10"
              style={{ flex: 1 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                style={{
                  background:
                    i < stepIndex
                      ? "oklch(0.72 0.13 75)"
                      : i === stepIndex
                        ? "oklch(0.18 0.04 240)"
                        : "white",
                  borderColor:
                    i <= stepIndex
                      ? "oklch(0.72 0.13 75)"
                      : "oklch(0.9 0.01 240)",
                }}
              >
                {i < stepIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : i === stepIndex ? (
                  <Truck className="w-5 h-5 text-white" />
                ) : (
                  <Package
                    className="w-4 h-4"
                    style={{ color: "oklch(0.7 0.01 240)" }}
                  />
                )}
              </div>
              <p
                className="mt-2 text-xs font-semibold text-center leading-tight"
                style={{
                  color:
                    i <= stepIndex
                      ? "oklch(0.18 0.04 240)"
                      : "oklch(0.6 0.01 240)",
                }}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-5 pt-4 flex items-center gap-2"
          style={{ borderTop: "1px solid oklch(0.93 0.01 240)" }}
        >
          <span className="text-sm font-semibold text-muted-foreground">
            Current Status:
          </span>
          <span
            className="px-3 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: "oklch(0.95 0.04 75)",
              color: "oklch(0.45 0.12 75)",
            }}
          >
            {shipment.status}
          </span>
        </div>
      </div>

      {/* Shipment Info */}
      <div className="bg-white rounded-xl shadow-card border border-border p-6 mb-6">
        <h3
          className="font-display font-bold text-sm uppercase tracking-widest mb-4"
          style={{ color: "oklch(0.18 0.04 240)" }}
        >
          Shipment Information
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Service Type", value: shipment.serviceType },
            { label: "Weight", value: shipment.weight },
            { label: "Origin", value: shipment.origin },
            { label: "Destination", value: shipment.destination },
            { label: "Est. Delivery", value: shipment.estimatedDelivery },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sender / Recipient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <InfoCard
          title="Sender Details"
          fields={[
            {
              icon: <User className="w-4 h-4" />,
              label: "Name",
              value: shipment.senderName,
            },
            {
              icon: <Home className="w-4 h-4" />,
              label: "Address",
              value: shipment.senderAddress,
            },
            {
              icon: <MapPin className="w-4 h-4" />,
              label: "Origin",
              value: shipment.origin,
            },
          ]}
        />
        <InfoCard
          title="Recipient Details"
          fields={[
            {
              icon: <User className="w-4 h-4" />,
              label: "Name",
              value: shipment.recipientName,
            },
            {
              icon: <Home className="w-4 h-4" />,
              label: "Address",
              value: shipment.recipientAddress,
            },
            {
              icon: <Phone className="w-4 h-4" />,
              label: "Phone",
              value: shipment.recipientPhone,
            },
          ]}
        />
      </div>

      {/* Timeline Events */}
      {shipment.timeline && shipment.timeline.length > 0 && (
        <div className="bg-white rounded-xl shadow-card border border-border p-6">
          <h3
            className="font-display font-bold text-sm uppercase tracking-widest mb-5"
            style={{ color: "oklch(0.18 0.04 240)" }}
          >
            Tracking Timeline
          </h3>
          <div className="relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ background: "oklch(0.93 0.01 240)" }}
            />
            <div className="space-y-5">
              {[...shipment.timeline].reverse().map((event, i) => (
                <div
                  key={`${event.date}-${event.location}`}
                  className="flex gap-4 relative"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{
                      background:
                        i === 0 ? "oklch(0.72 0.13 75)" : "oklch(0.9 0.01 240)",
                    }}
                  >
                    <Clock
                      className="w-3.5 h-3.5"
                      style={{
                        color: i === 0 ? "white" : "oklch(0.55 0.01 240)",
                      }}
                    />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      {event.event}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.location} · {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
