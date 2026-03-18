import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Package, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import TrackingResult from "../components/TrackingResult";
import { useGetShipment } from "../hooks/useQueries";

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [trackedNumber, setTrackedNumber] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data: shipment, isLoading, isError } = useGetShipment(trackedNumber);

  const handleTrack = () => {
    const val = inputValue.trim();
    if (!val) return;
    setTrackedNumber(val);
    setTimeout(
      () =>
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      300,
    );
  };

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-[580px] flex flex-col items-center justify-center text-center px-4 py-20"
        style={{ overflow: "hidden" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-highway.dim_1600x900.jpg')",
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,26,43,0.82) 0%, rgba(11,26,43,0.72) 50%, rgba(11,26,43,0.90) 100%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
              style={{ color: "oklch(0.72 0.13 75)" }}
            >
              Trusted Worldwide Delivery
            </p>
            <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">
              Track Your Package{" "}
              <span style={{ color: "oklch(0.72 0.13 75)" }}>Anywhere</span>
            </h1>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Real-time shipment tracking for FAST-LINE COURIER SERVICE. Enter
              your tracking number below to get instant updates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <Input
              placeholder="Enter Tracking Number (e.g. FL-2025-001)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="flex-1 h-14 text-base px-5 bg-white/95 border-0 text-foreground placeholder:text-muted-foreground rounded-lg"
              data-ocid="tracking.input"
            />
            <Button
              onClick={handleTrack}
              disabled={isLoading}
              className="h-14 px-8 font-bold text-sm tracking-widest rounded-lg whitespace-nowrap"
              style={{
                background: "oklch(0.72 0.13 75)",
                color: "oklch(0.18 0.04 240)",
                boxShadow: "0 4px 20px rgba(210,162,58,0.4)",
              }}
              data-ocid="tracking.submit_button"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> TRACK NOW
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section
        style={{
          background:
            "linear-gradient(90deg, oklch(0.18 0.04 240), oklch(0.22 0.055 240))",
        }}
        className="py-6"
      >
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "150+", label: "Countries Served" },
            { value: "2M+", label: "Packages Delivered" },
            { value: "99.8%", label: "On-Time Rate" },
            { value: "24/7", label: "Customer Support" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="font-display font-bold text-2xl"
                style={{ color: "oklch(0.72 0.13 75)" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-white/60 font-medium mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section
        ref={resultsRef}
        className="min-h-[300px] py-16 px-4"
        style={{ background: "oklch(0.97 0.005 240)" }}
      >
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!trackedNumber && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
                data-ocid="tracking.empty_state"
              >
                <Package
                  className="w-16 h-16 mx-auto mb-4 opacity-20"
                  style={{ color: "oklch(0.18 0.04 240)" }}
                />
                <p className="text-muted-foreground font-medium">
                  Enter a tracking number above to see shipment details
                </p>
              </motion.div>
            )}

            {isLoading && trackedNumber && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-20 gap-4"
                data-ocid="tracking.loading_state"
              >
                <Loader2
                  className="w-12 h-12 animate-spin"
                  style={{ color: "oklch(0.72 0.13 75)" }}
                />
                <p className="text-muted-foreground font-medium">
                  Looking up your shipment...
                </p>
              </motion.div>
            )}

            {!isLoading && shipment && (
              <TrackingResult key={trackedNumber} shipment={shipment} />
            )}

            {!isLoading && trackedNumber && shipment === null && (
              <motion.div
                key="notfound"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
                data-ocid="tracking.error_state"
              >
                <AlertCircle
                  className="w-14 h-14 mx-auto mb-4"
                  style={{ color: "oklch(0.72 0.13 75)" }}
                />
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  Shipment Not Found
                </h3>
                <p className="text-muted-foreground">
                  No shipment found for tracking number{" "}
                  <strong>{trackedNumber}</strong>. Please check and try again.
                </p>
              </motion.div>
            )}

            {isError && (
              <motion.div
                key="error"
                className="text-center py-16"
                data-ocid="tracking.error_state"
              >
                <AlertCircle className="w-14 h-14 mx-auto mb-4 text-destructive" />
                <p className="text-muted-foreground">
                  Error fetching shipment. Please try again.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: "oklch(0.72 0.13 75)" }}
            >
              What We Offer
            </p>
            <h2
              className="font-display font-bold text-3xl"
              style={{ color: "oklch(0.18 0.04 240)" }}
            >
              Our Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Express Delivery",
                desc: "Same-day and next-day delivery for urgent shipments across the country.",
                icon: "🚀",
              },
              {
                title: "International Freight",
                desc: "Reliable cargo services to 150+ countries with customs clearance support.",
                icon: "🌍",
              },
              {
                title: "Secure Storage",
                desc: "Climate-controlled warehousing with 24/7 CCTV security monitoring.",
                icon: "🔒",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl p-6 border border-border hover:shadow-card transition-shadow"
                style={{ background: "oklch(0.97 0.005 240)" }}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3
                  className="font-display font-bold text-lg mb-2"
                  style={{ color: "oklch(0.18 0.04 240)" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
