import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Loader2,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Shipment } from "../backend.d";
import ReceiptDialog from "../components/ReceiptDialog";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateShipment,
  useDeleteShipment,
  useGetAllShipments,
  useUpdateShipmentStatus,
} from "../hooks/useQueries";

const STATUSES = [
  "Order Placed",
  "Pending Pickup",
  "Processing",
  "In Transit",
  "Customs Clearance",
  "Out for Delivery",
  "On Hold",
  "Delivered",
  "Failed Delivery",
  "Returned",
];

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  "Order Placed": {
    bg: "oklch(0.93 0.06 240)",
    color: "oklch(0.3 0.12 240)",
    label: "Order Placed",
  },
  "Pending Pickup": {
    bg: "oklch(0.93 0.06 310)",
    color: "oklch(0.35 0.12 310)",
    label: "Pending Pickup",
  },
  Processing: {
    bg: "oklch(0.93 0.07 195)",
    color: "oklch(0.35 0.12 195)",
    label: "Processing",
  },
  "In Transit": {
    bg: "oklch(0.93 0.1 60)",
    color: "oklch(0.4 0.14 55)",
    label: "In Transit",
  },
  "Customs Clearance": {
    bg: "oklch(0.93 0.09 55)",
    color: "oklch(0.42 0.13 45)",
    label: "Customs Clearance",
  },
  "Out for Delivery": {
    bg: "oklch(0.93 0.08 290)",
    color: "oklch(0.38 0.15 290)",
    label: "Out for Delivery",
  },
  "On Hold": {
    bg: "oklch(0.94 0.09 85)",
    color: "oklch(0.42 0.14 80)",
    label: "On Hold",
  },
  Delivered: {
    bg: "oklch(0.92 0.1 145)",
    color: "oklch(0.35 0.14 145)",
    label: "Delivered",
  },
  "Failed Delivery": {
    bg: "oklch(0.93 0.07 25)",
    color: "oklch(0.42 0.15 25)",
    label: "Failed Delivery",
  },
  Returned: {
    bg: "oklch(0.92 0.08 25)",
    color: "oklch(0.4 0.14 25)",
    label: "Returned",
  },
};

function generateTrackingNumber() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `FL-2026-${digits}`;
}

function FormSection({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div
        className="text-xs font-bold uppercase tracking-widest pb-1 border-b"
        style={{
          color: "oklch(0.72 0.13 75)",
          borderColor: "oklch(0.9 0.02 240)",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function CreateShipmentDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const createMut = useCreateShipment();
  const emptyForm = {
    trackingNumber: "",
    senderName: "",
    senderAddress: "",
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
    origin: "",
    destination: "",
    weight: "",
    serviceType: "",
    estimatedDelivery: "",
    shippingCost: "0.00",
    handlingFee: "0.00",
  };
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMut.mutateAsync(form);
      toast.success("Shipment created successfully!");
      setOpen(false);
      setForm(emptyForm);
      onCreated();
    } catch {
      toast.error("Failed to create shipment.");
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder = "",
    type = "text",
  ) => (
    <div className="space-y-1">
      <Label htmlFor={key} className="text-xs font-semibold">
        {label}
      </Label>
      <Input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder || label}
        required
        className="h-9 text-sm"
        data-ocid="create_shipment.input"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="font-bold text-sm h-10 px-5"
          style={{
            background: "oklch(0.72 0.13 75)",
            color: "oklch(0.18 0.04 240)",
          }}
          data-ocid="admin.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-2" /> New Shipment
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.dialog"
      >
        <DialogHeader>
          <DialogTitle
            className="font-display font-bold text-lg"
            style={{ color: "oklch(0.18 0.04 240)" }}
          >
            Create New Shipment
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-3">
          <FormSection title="Shipment Info">
            <div className="space-y-1">
              <Label htmlFor="trackingNumber" className="text-xs font-semibold">
                Tracking Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="trackingNumber"
                  value={form.trackingNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trackingNumber: e.target.value }))
                  }
                  placeholder="FL-2026-0001"
                  required
                  className="h-9 text-sm font-mono"
                  data-ocid="create_shipment.input"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 text-xs whitespace-nowrap"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      trackingNumber: generateTrackingNumber(),
                    }))
                  }
                  data-ocid="create_shipment.secondary_button"
                >
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("serviceType", "Service Type", "Express / Standard")}
              {field("weight", "Weight", "2.5 kg")}
              {field(
                "estimatedDelivery",
                "Est. Delivery",
                "2026-03-25",
                "date",
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("shippingCost", "Shipping Cost ($)", "0.00", "number")}
              {field("handlingFee", "Handling Fee ($)", "0.00", "number")}
            </div>
          </FormSection>

          <FormSection title="Sender">
            <div className="grid grid-cols-1 gap-3">
              {field("senderName", "Sender Name", "John Doe")}
              {field(
                "senderAddress",
                "Sender Address",
                "123 Main St, New York",
              )}
            </div>
          </FormSection>

          <FormSection title="Recipient">
            <div className="grid grid-cols-1 gap-3">
              {field("recipientName", "Recipient Name", "Jane Smith")}
              {field(
                "recipientAddress",
                "Recipient Address",
                "456 High St, London",
              )}
              {field("recipientPhone", "Recipient Phone", "+44 20 1234 5678")}
            </div>
          </FormSection>

          <FormSection title="Route">
            <div className="grid grid-cols-2 gap-3">
              {field("origin", "Origin", "New York, USA")}
              {field("destination", "Destination", "London, UK")}
            </div>
          </FormSection>

          <Button
            type="submit"
            disabled={createMut.isPending}
            className="w-full font-bold h-10"
            style={{ background: "oklch(0.18 0.04 240)", color: "white" }}
            data-ocid="create_shipment.submit_button"
          >
            {createMut.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Create Shipment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UpdateStatusDialog({ shipment }: { shipment: Shipment }) {
  const [open, setOpen] = useState(false);
  const updateMut = useUpdateShipmentStatus();
  const [status, setStatus] = useState(shipment.status);
  const [eventText, setEventText] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMut.mutateAsync({
        trackingNumber: shipment.trackingNumber,
        status,
        event: { event: eventText, location, date },
      });
      toast.success("Status updated!");
      setOpen(false);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-semibold"
          data-ocid="admin.edit_button"
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Update
        </Button>
      </DialogTrigger>
      <DialogContent data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle
            className="font-display font-bold"
            style={{ color: "oklch(0.18 0.04 240)" }}
          >
            Update Status
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-mono">
            {shipment.trackingNumber}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9" data-ocid="admin.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Event Description</Label>
            <Input
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="Package scanned at facility"
              required
              className="h-9 text-sm"
              data-ocid="admin.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="New York Hub"
                required
                className="h-9 text-sm"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-9 text-sm"
                data-ocid="admin.input"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={updateMut.isPending}
            className="w-full font-bold h-10"
            style={{
              background: "oklch(0.72 0.13 75)",
              color: "oklch(0.18 0.04 240)",
            }}
            data-ocid="admin.confirm_button"
          >
            {updateMut.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Update Status
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ShipmentCard({
  shipment,
  index,
  onDelete,
  isDeleting,
}: {
  shipment: Shipment;
  index: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const style = STATUS_STYLES[shipment.status] ?? STATUS_STYLES["Order Placed"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4"
      style={{ borderColor: "oklch(0.9 0.02 240)" }}
      data-ocid={`admin.item.${index + 1}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="font-mono font-bold text-base tracking-wider"
            style={{ color: "oklch(0.18 0.04 240)" }}
          >
            {shipment.trackingNumber}
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            {shipment.serviceType} · {shipment.weight}
          </p>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
          style={{ background: style.bg, color: style.color }}
        >
          {style.label}
        </span>
      </div>

      {/* Sender → Recipient */}
      <div
        className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
        style={{ background: "oklch(0.97 0.005 240)" }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">From</p>
          <p
            className="font-semibold truncate"
            style={{ color: "oklch(0.18 0.04 240)" }}
          >
            {shipment.senderName}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0 text-right">
          <p className="text-xs text-muted-foreground">To</p>
          <p
            className="font-semibold truncate"
            style={{ color: "oklch(0.18 0.04 240)" }}
          >
            {shipment.recipientName}
          </p>
        </div>
      </div>

      {/* Route + ETA */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {shipment.origin} <span className="mx-1">→</span>{" "}
          {shipment.destination}
        </span>
        {shipment.estimatedDelivery && (
          <span>
            ETA: <strong>{shipment.estimatedDelivery}</strong>
          </span>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 pt-1 border-t"
        style={{ borderColor: "oklch(0.92 0.02 240)" }}
      >
        <UpdateStatusDialog shipment={shipment} />
        <ReceiptDialog shipment={shipment} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
          onClick={() => onDelete(shipment.trackingNumber)}
          disabled={isDeleting}
          data-ocid={`admin.delete_button.${index + 1}`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
        </Button>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const { data: shipments = [], isLoading } = useGetAllShipments();
  const deleteMut = useDeleteShipment();
  const { clear, identity } = useInternetIdentity();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDelete = async (trackingNumber: string) => {
    if (!confirm(`Delete shipment ${trackingNumber}?`)) return;
    try {
      await deleteMut.mutateAsync(trackingNumber);
      toast.success("Shipment deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const filteredShipments = shipments.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.trackingNumber.toLowerCase().includes(q) ||
      s.senderName.toLowerCase().includes(q) ||
      s.recipientName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isFiltered = search.trim() !== "" || statusFilter !== "all";

  // Status counts
  const counts: Record<string, number> = {};
  for (const s of STATUSES) {
    counts[s] = shipments.filter((sh) => sh.status === s).length;
  }

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  return (
    <main
      className="min-h-screen"
      style={{ background: "oklch(0.97 0.005 240)" }}
    >
      {/* Admin Header */}
      <div
        className="px-4 py-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.04 240), oklch(0.22 0.055 240))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">
              Admin Panel
            </h1>
            <p className="text-white/60 text-xs mt-0.5">
              FAST-LINE COURIER SERVICE
              {shortPrincipal ? ` · ${shortPrincipal}` : ""}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-9"
            onClick={() => {
              clear();
              window.location.hash = "";
            }}
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div
            className="rounded-xl px-5 py-3 flex items-center gap-3 border"
            style={{ background: "white", borderColor: "oklch(0.9 0.02 240)" }}
          >
            <Package
              className="w-5 h-5"
              style={{ color: "oklch(0.72 0.13 75)" }}
            />
            <div>
              <p
                className="text-2xl font-bold leading-none"
                style={{ color: "oklch(0.18 0.04 240)" }}
              >
                {shipments.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Shipments</p>
            </div>
          </div>
          {STATUSES.map((s) => (
            <div
              key={s}
              className="rounded-lg px-3 py-2 text-xs font-semibold border"
              style={{
                background: STATUS_STYLES[s]?.bg ?? "white",
                color: STATUS_STYLES[s]?.color ?? "inherit",
                borderColor: "transparent",
              }}
            >
              {counts[s] ?? 0} {s}
            </div>
          ))}
          <div className="ml-auto">
            <CreateShipmentDialog onCreated={() => {}} />
          </div>
        </div>

        {/* Search + Filter bar */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-xl border bg-white"
          style={{ borderColor: "oklch(0.9 0.02 240)" }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tracking number, sender, or recipient..."
              className="h-9 text-sm pl-9"
              data-ocid="admin.search_input"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="h-9 w-full sm:w-52 text-sm"
              data-ocid="admin.select"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFiltered && (
            <div
              className="flex items-center text-xs font-semibold whitespace-nowrap px-3 py-1 rounded-lg self-center"
              style={{
                background: "oklch(0.93 0.06 240)",
                color: "oklch(0.3 0.12 240)",
              }}
            >
              {filteredShipments.length} of {shipments.length} shipments
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div
            className="flex items-center justify-center py-24"
            data-ocid="admin.loading_state"
          >
            <Loader2
              className="w-10 h-10 animate-spin"
              style={{ color: "oklch(0.72 0.13 75)" }}
            />
          </div>
        ) : shipments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
            data-ocid="admin.empty_state"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "oklch(0.93 0.02 240)" }}
            >
              <Package
                className="w-9 h-9"
                style={{ color: "oklch(0.72 0.13 75)" }}
              />
            </div>
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "oklch(0.18 0.04 240)" }}
            >
              No shipments yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              Click <strong>New Shipment</strong> above to create your first
              shipment. Customers can then track it on the homepage.
            </p>
            <CreateShipmentDialog onCreated={() => {}} />
          </motion.div>
        ) : filteredShipments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            data-ocid="admin.empty_state"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "oklch(0.93 0.02 240)" }}
            >
              <Search
                className="w-7 h-7"
                style={{ color: "oklch(0.72 0.13 75)" }}
              />
            </div>
            <h3
              className="font-bold text-base mb-1"
              style={{ color: "oklch(0.18 0.04 240)" }}
            >
              No results found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term or status filter.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShipments.map((s, i) => (
              <ShipmentCard
                key={s.trackingNumber}
                shipment={s}
                index={i}
                onDelete={handleDelete}
                isDeleting={deleteMut.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
