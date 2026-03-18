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
import { FileText, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import type { Shipment } from "../backend.d";

function generateReceiptNumber() {
  const digits = Math.floor(1000000 + Math.random() * 9000000);
  return `INTL-${digits}`;
}

function formatCurrency(val: string) {
  const num = Number.parseFloat(val) || 0;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const PRINT_STYLES = `
@media print {
  body > * { display: none !important; }
  #receipt-print-area,
  #receipt-print-area * { display: block !important; visibility: visible !important; }
  #receipt-print-area { position: fixed; top: 0; left: 0; width: 100%; background: white; z-index: 99999; }
  .receipt-no-print { display: none !important; }
}
`;

interface Props {
  shipment: Shipment;
}

export default function ReceiptDialog({ shipment }: Props) {
  const [open, setOpen] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [shippingCost, setShippingCost] = useState(
    (shipment as any).shippingCost || "0.00",
  );
  const [handlingFee, setHandlingFee] = useState(
    (shipment as any).handlingFee || "0.00",
  );
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  useEffect(() => {
    if (open) {
      setReceiptNumber(generateReceiptNumber());
      setShippingCost((shipment as any).shippingCost || "0.00");
      setHandlingFee((shipment as any).handlingFee || "0.00");
    }
  }, [open, shipment]);

  const total =
    (Number.parseFloat(shippingCost) || 0) +
    (Number.parseFloat(handlingFee) || 0);
  const today = formatDate(new Date());

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = PRINT_STYLES;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-semibold"
            data-ocid="admin.open_modal_button"
          >
            <FileText className="w-3 h-3 mr-1" /> Receipt
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-3xl max-h-[92vh] overflow-y-auto"
          data-ocid="receipt.dialog"
        >
          <DialogHeader className="receipt-no-print">
            <DialogTitle style={{ color: "oklch(0.18 0.04 240)" }}>
              Generate Receipt
            </DialogTitle>
          </DialogHeader>

          {/* Payment Form */}
          <div
            className="receipt-no-print space-y-4 pb-4 border-b mb-4"
            style={{ borderColor: "oklch(0.9 0.02 240)" }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Receipt Number</Label>
                <Input
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="h-9 text-sm font-mono"
                  data-ocid="receipt.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-9" data-ocid="receipt.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Shipping Cost ($)
                </Label>
                <Input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="h-9 text-sm"
                  data-ocid="receipt.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Handling Fee ($)
                </Label>
                <Input
                  type="number"
                  value={handlingFee}
                  onChange={(e) => setHandlingFee(e.target.value)}
                  className="h-9 text-sm"
                  data-ocid="receipt.input"
                />
              </div>
            </div>
            <div
              className="rounded-lg px-4 py-2.5 flex justify-between items-center"
              style={{ background: "oklch(0.18 0.04 240)" }}
            >
              <span className="text-white text-sm font-semibold">
                Total Paid
              </span>
              <span className="text-white font-bold text-lg">
                {formatCurrency(total.toString())}
              </span>
            </div>
            <Button
              type="button"
              onClick={handlePrint}
              className="w-full font-bold h-10"
              style={{
                background: "oklch(0.72 0.13 75)",
                color: "oklch(0.18 0.04 240)",
              }}
              data-ocid="receipt.primary_button"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Receipt
            </Button>
          </div>

          {/* ===== PRINTABLE RECEIPT ===== */}
          <div
            id="receipt-print-area"
            style={{
              background: "white",
              width: "100%",
              fontFamily: "Arial, sans-serif",
              fontSize: "11px",
              color: "#1a1a1a",
              border: "1px solid #ddd",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: "2px solid #D2A23A",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "28px" }}>✈</span>
                <div>
                  <div
                    style={{
                      fontWeight: "900",
                      fontSize: "20px",
                      color: "#0B1A2B",
                      letterSpacing: "2px",
                      lineHeight: 1,
                    }}
                  >
                    FAST-LINE
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "10px",
                      color: "#D2A23A",
                      letterSpacing: "3px",
                    }}
                  >
                    COURIER SERVICES
                  </div>
                </div>
              </div>
              <div
                style={{ textAlign: "right", fontSize: "10px", color: "#444" }}
              >
                <div style={{ marginBottom: "3px" }}>
                  📧 info@fastlinecourier.com
                </div>
                <div>📞 +1-800-123-4567</div>
              </div>
            </div>

            {/* Title bar */}
            <div
              style={{
                background: "#0B1A2B",
                color: "white",
                textAlign: "center",
                padding: "8px",
                fontWeight: "700",
                fontSize: "12px",
                letterSpacing: "2px",
              }}
            >
              INTERNATIONAL SHIPPING RECEIPT
            </div>

            {/* Receipt info bar */}
            <div
              style={{
                background: "#e8edf4",
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 18px",
                fontSize: "10px",
                fontWeight: "600",
              }}
            >
              <span style={{ color: "#0B1A2B" }}>
                Receipt No.: <strong>{receiptNumber}</strong>
              </span>
              <span style={{ color: "#0B1A2B" }}>
                Date: <strong>{today}</strong>
              </span>
            </div>

            {/* Sender info */}
            <div
              style={{
                padding: "10px 18px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  background: "#dce8f4",
                  color: "#0B1A2B",
                  fontWeight: "700",
                  fontSize: "10px",
                  padding: "3px 6px",
                  marginBottom: "6px",
                  display: "inline-block",
                }}
              >
                Sender Information:
              </div>
              <div style={{ fontWeight: "700", color: "#0B1A2B" }}>
                {shipment.senderName}
              </div>
              <div style={{ color: "#555" }}>{shipment.senderAddress}</div>
            </div>

            {/* Recipient + Shipment Summary side by side */}
            <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0" }}>
              <div
                style={{
                  flex: 1,
                  padding: "10px 18px",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    background: "#dce8f4",
                    color: "#0B1A2B",
                    fontWeight: "700",
                    fontSize: "10px",
                    padding: "3px 6px",
                    marginBottom: "6px",
                    display: "inline-block",
                  }}
                >
                  Recipient Information:
                </div>
                <div style={{ fontWeight: "700", color: "#0B1A2B" }}>
                  {shipment.recipientName}
                </div>
                <div style={{ color: "#555" }}>{shipment.recipientAddress}</div>
                {shipment.recipientPhone && (
                  <div style={{ color: "#555" }}>{shipment.recipientPhone}</div>
                )}
              </div>
              <div style={{ flex: 1, padding: "10px 18px" }}>
                <div
                  style={{
                    background: "#dce8f4",
                    color: "#0B1A2B",
                    fontWeight: "700",
                    fontSize: "10px",
                    padding: "3px 6px",
                    marginBottom: "6px",
                    display: "inline-block",
                  }}
                >
                  Payment Summary:
                </div>
                <table
                  style={{
                    width: "100%",
                    fontSize: "10px",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "2px 0" }}>Shipping Cost</td>
                      <td style={{ textAlign: "right", padding: "2px 0" }}>
                        {formatCurrency(shippingCost)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 0" }}>Handling Fee</td>
                      <td style={{ textAlign: "right", padding: "2px 0" }}>
                        {formatCurrency(handlingFee)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ padding: "2px 0" }} />
                    </tr>
                    <tr style={{ background: "#0B1A2B", color: "white" }}>
                      <td style={{ padding: "4px 6px", fontWeight: "700" }}>
                        Total Paid
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: "4px 6px",
                          fontWeight: "700",
                        }}
                      >
                        {formatCurrency(total.toString())}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "3px 0" }}>Payment Method</td>
                      <td style={{ textAlign: "right", padding: "3px 0" }}>
                        {paymentMethod}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 0" }}>Payment Status</td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: "2px 0",
                          color: "#16a34a",
                          fontWeight: "700",
                        }}
                      >
                        ✓ PAID
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipment Details */}
            <div
              style={{
                padding: "10px 18px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  background: "#dce8f4",
                  color: "#0B1A2B",
                  fontWeight: "700",
                  fontSize: "10px",
                  padding: "3px 6px",
                  marginBottom: "6px",
                  display: "inline-block",
                }}
              >
                Shipment Details:
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "16px",
                  color: "#333",
                  lineHeight: "1.8",
                }}
              >
                <li>
                  <strong>Service Type:</strong> {shipment.serviceType}
                </li>
                <li>
                  <strong>Origin:</strong> {shipment.origin}
                </li>
                <li>
                  <strong>Destination:</strong> {shipment.destination}
                </li>
                <li>
                  <strong>Weight:</strong> {shipment.weight}
                </li>
                <li>
                  <strong>Tracking Number:</strong>{" "}
                  <span style={{ fontFamily: "monospace", fontWeight: "700" }}>
                    {shipment.trackingNumber}
                  </span>
                </li>
              </ul>
            </div>

            {/* Payment Details + Stamp */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "14px 18px",
                borderBottom: "1px solid #e0e0e0",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    background: "#dce8f4",
                    color: "#0B1A2B",
                    fontWeight: "700",
                    fontSize: "10px",
                    padding: "3px 6px",
                    marginBottom: "6px",
                    display: "inline-block",
                  }}
                >
                  Payment Details:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "16px",
                    color: "#333",
                    lineHeight: "1.8",
                  }}
                >
                  <li>Shipping Cost: {formatCurrency(shippingCost)}</li>
                  <li>Handling Fee: {formatCurrency(handlingFee)}</li>
                </ul>
                <div
                  style={{
                    marginTop: "8px",
                    background: "#0B1A2B",
                    color: "#D2A23A",
                    padding: "5px 10px",
                    fontWeight: "700",
                    fontSize: "11px",
                    borderRadius: "2px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>TOTAL PAID</span>
                  <span>{formatCurrency(total.toString())}</span>
                </div>
              </div>

              {/* CSS Stamp */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "110px",
                }}
              >
                <div
                  style={{
                    width: "110px",
                    height: "110px",
                    border: "3px solid #0B1A2B",
                    borderRadius: "50%",
                    outline: "5px solid #0B1A2B",
                    outlineOffset: "3px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(-15deg)",
                    flexDirection: "column",
                    position: "relative",
                    boxShadow: "0 0 0 2px white, 0 0 0 5px #0B1A2B",
                    opacity: 0.85,
                  }}
                >
                  <svg
                    role="img"
                    aria-label="PAID stamp"
                    viewBox="0 0 110 110"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <defs>
                      <path id="topArc" d="M 15,55 A 40,40 0 0,1 95,55" />
                      <path id="bottomArc" d="M 18,62 A 38,38 0 0,0 92,62" />
                    </defs>
                    <text
                      fill="#0B1A2B"
                      fontSize="9"
                      fontWeight="700"
                      letterSpacing="2"
                    >
                      <textPath href="#topArc">★ FAST-LINE ★</textPath>
                    </text>
                    <text
                      fill="#0B1A2B"
                      fontSize="8"
                      fontWeight="700"
                      letterSpacing="1.5"
                    >
                      <textPath href="#bottomArc" startOffset="5%">
                        COURIER SERVICES
                      </textPath>
                    </text>
                    <text
                      x="55"
                      y="62"
                      textAnchor="middle"
                      fill="#0B1A2B"
                      fontSize="22"
                      fontWeight="900"
                      letterSpacing="1"
                    >
                      PAID
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 18px",
                borderBottom: "1px solid #e0e0e0",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    background: "#dce8f4",
                    color: "#0B1A2B",
                    fontWeight: "700",
                    fontSize: "10px",
                    padding: "3px 6px",
                    marginBottom: "6px",
                    display: "inline-block",
                  }}
                >
                  Notes:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "16px",
                    color: "#444",
                    lineHeight: "1.8",
                  }}
                >
                  <li>Delivery time estimated: 5–10 business days</li>
                  <li>Signature required upon delivery</li>
                  <li>Non-refundable after dispatch</li>
                </ul>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "10px",
                  color: "#444",
                  paddingTop: "20px",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    color: "#0B1A2B",
                    marginBottom: "3px",
                  }}
                >
                  Authorized By:
                </div>
                <div>International Shipping Office</div>
                <div>Tel Aviv, Israel</div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                background: "#D2A23A",
                textAlign: "center",
                padding: "10px",
                color: "white",
                fontWeight: "700",
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              Thank you for your business!
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
