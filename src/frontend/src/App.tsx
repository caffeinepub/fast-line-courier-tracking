import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
  LogIn,
  Send,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useClaimFirstAdmin,
  useIsAdmin,
  useIsFirstAdminClaimed,
} from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

function AdminLoginPrompt() {
  const { login, isLoggingIn, isInitializing, isLoginError, loginError } =
    useInternetIdentity() as any;

  return (
    <div
      className="flex items-center justify-center min-h-[80vh] px-4"
      style={{ background: "oklch(0.97 0.005 240)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-xl p-8 text-center border"
        style={{
          background: "white",
          borderColor: "oklch(0.88 0.02 240)",
        }}
        data-ocid="admin.modal"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "oklch(0.18 0.04 240)" }}
        >
          {isInitializing ? (
            <Loader2
              className="w-7 h-7 text-white animate-spin"
              strokeWidth={2}
            />
          ) : (
            <Send className="w-7 h-7 text-white -rotate-45" strokeWidth={2} />
          )}
        </div>

        <h1
          className="font-display font-bold text-2xl mb-2"
          style={{ color: "oklch(0.18 0.04 240)" }}
        >
          Admin Access
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Log in to access the FAST-LINE admin panel
        </p>

        {isLoginError && (
          <div
            className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
            style={{
              background: "oklch(0.95 0.03 25)",
              color: "oklch(0.45 0.18 25)",
            }}
            data-ocid="admin.error_state"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {loginError?.message ?? "Login failed. Please try again."}
          </div>
        )}

        <Button
          onClick={() => login()}
          disabled={isLoggingIn || isInitializing}
          className="w-full font-bold text-sm h-11"
          style={{
            background: "oklch(0.72 0.13 75)",
            color: "oklch(0.18 0.04 240)",
          }}
          data-ocid="admin.primary_button"
        >
          {isInitializing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Preparing...
            </span>
          ) : isLoggingIn ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login with Internet Identity
            </span>
          )}
        </Button>

        <p className="mt-5 text-xs text-muted-foreground">
          Access is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}

function AccessDeniedScreen() {
  const { identity } = useInternetIdentity();
  const { data: isClaimed, isLoading: isClaimedLoading } =
    useIsFirstAdminClaimed();
  const claimAdmin = useClaimFirstAdmin();

  const principalId = identity?.getPrincipal().toText() ?? "";

  if (isClaimedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span
          className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"
          style={{ color: "oklch(0.72 0.13 75)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-[80vh] px-4"
      style={{ background: "oklch(0.97 0.005 240)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8 text-center border"
        style={{
          background: "white",
          borderColor: "oklch(0.88 0.02 240)",
        }}
        data-ocid="admin.modal"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: isClaimed
              ? "oklch(0.55 0.18 25)"
              : "oklch(0.18 0.04 240)",
          }}
        >
          {isClaimed ? (
            <ShieldAlert className="w-7 h-7 text-white" strokeWidth={2} />
          ) : (
            <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2} />
          )}
        </div>

        {!isClaimed ? (
          <>
            <h1
              className="font-display font-bold text-2xl mb-2"
              style={{ color: "oklch(0.18 0.04 240)" }}
            >
              Claim Admin Access
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              No administrator has been set up yet. Click below to authorize
              your Internet Identity as the admin.
            </p>

            {claimAdmin.isError && (
              <div
                className="mb-4 p-3 rounded-lg text-sm"
                style={{
                  background: "oklch(0.95 0.03 25)",
                  color: "oklch(0.45 0.18 25)",
                }}
                data-ocid="admin.error_state"
              >
                Failed to claim admin access. Please try again.
              </div>
            )}

            {claimAdmin.isSuccess ? (
              <div
                className="mb-4 p-3 rounded-lg text-sm font-medium"
                style={{
                  background: "oklch(0.95 0.05 145)",
                  color: "oklch(0.35 0.12 145)",
                }}
                data-ocid="admin.success_state"
              >
                Admin access granted! Redirecting...
              </div>
            ) : (
              <Button
                onClick={() => claimAdmin.mutate()}
                disabled={claimAdmin.isPending}
                className="w-full font-bold text-sm h-11"
                style={{
                  background: "oklch(0.72 0.13 75)",
                  color: "oklch(0.18 0.04 240)",
                }}
                data-ocid="admin.primary_button"
              >
                {claimAdmin.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Claiming Admin Access...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Claim Admin Access
                  </span>
                )}
              </Button>
            )}
          </>
        ) : (
          <>
            <h1
              className="font-display font-bold text-2xl mb-2"
              style={{ color: "oklch(0.45 0.18 25)" }}
            >
              Access Denied
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your account does not have admin privileges.
            </p>

            <div
              className="rounded-xl p-4 text-left border"
              style={{
                background: "oklch(0.97 0.005 240)",
                borderColor: "oklch(0.88 0.02 240)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "oklch(0.18 0.04 240)" }}
              >
                Your Principal ID
              </p>
              <p
                className="text-xs font-mono break-all"
                style={{ color: "oklch(0.35 0.05 240)" }}
                data-ocid="admin.panel"
              >
                {principalId}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Share this ID with your administrator to request access.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AppShell() {
  const [hash, setHash] = useState(window.location.hash);
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const isAdminRoute = hash === "#/admin";
  const isLoggedIn = !!identity;
  const isCheckingAccess = isInitializing || (isLoggedIn && isAdminLoading);

  const loadingMessage = isInitializing
    ? "Restoring your session..."
    : "Checking permissions...";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {!isAdminRoute && <HomePage />}
        {isAdminRoute && isCheckingAccess && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
            <span
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: "oklch(0.18 0.04 240)",
                borderTopColor: "transparent",
              }}
            />
            <p className="text-sm" style={{ color: "oklch(0.45 0.04 240)" }}>
              {loadingMessage}
            </p>
          </div>
        )}
        {isAdminRoute && !isCheckingAccess && !isLoggedIn && (
          <AdminLoginPrompt />
        )}
        {isAdminRoute && !isCheckingAccess && isLoggedIn && !isAdmin && (
          <AccessDeniedScreen />
        )}
        {isAdminRoute && !isCheckingAccess && isLoggedIn && isAdmin && (
          <AdminPage />
        )}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
