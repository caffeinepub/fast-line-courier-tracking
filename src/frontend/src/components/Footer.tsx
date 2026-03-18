import {
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  Twitter,
} from "lucide-react";

const SOCIAL_ICONS = [
  { Icon: Facebook, name: "Facebook" },
  { Icon: Twitter, name: "Twitter" },
  { Icon: Instagram, name: "Instagram" },
  { Icon: Linkedin, name: "LinkedIn" },
];

const QUICK_LINKS = [
  "Home",
  "Track Shipment",
  "Our Services",
  "About Us",
  "Contact",
];
const LEGAL_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Disclaimer",
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer
      style={{
        background:
          "linear-gradient(135deg, oklch(0.14 0.04 240), oklch(0.20 0.055 240))",
      }}
      className="relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.72 0.13 75)" }}
              >
                <Send
                  className="w-4 h-4 text-white -rotate-45"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <span className="font-display font-bold italic text-white text-sm block">
                  FAST-LINE
                </span>
                <span className="text-white/60 text-[10px] tracking-widest block">
                  COURIER SERVICE
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Delivering trust and speed worldwide. Your parcels are our
              priority — safe, secure, and on time.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL_ICONS.map(({ Icon, name }) => (
                <button
                  type="button"
                  key={name}
                  aria-label={name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ background: "oklch(0.72 0.13 75)" }}
                    />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Legal
            </h4>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ background: "oklch(0.72 0.13 75)" }}
                    />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-white/50 text-xs">
            © {year} FAST-LINE COURIER SERVICE. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs font-medium text-white/60 hover:text-white transition-colors"
            data-ocid="nav.button"
          >
            <ArrowUp className="w-3 h-3" /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
