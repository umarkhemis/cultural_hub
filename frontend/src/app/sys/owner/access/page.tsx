
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Terminal, AlertTriangle } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { writeTokenCookie } from "@/src/utils/auth-cookies";
import { apiClient } from "@/src/lib/api/client";

// ── Schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  email:    z.string().email("Invalid credentials."),
  password: z.string().min(1, "Invalid credentials."),
  totp:     z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// ── Rate-limit tracker (client-side courtesy — real limit is server-side) ──
const LOCKOUT_KEY  = "adm_lk";
const ATTEMPT_KEY  = "adm_at";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000;

function getClientLockout(): { locked: boolean; remaining: number } {
  if (typeof window === "undefined") return { locked: false, remaining: 0 };
  const lockUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) ?? "0", 10);
  if (lockUntil && Date.now() < lockUntil) {
    return { locked: true, remaining: Math.ceil((lockUntil - Date.now()) / 1000) };
  }
  return { locked: false, remaining: 0 };
}

function recordFailedAttempt(): void {
  const count = parseInt(localStorage.getItem(ATTEMPT_KEY) ?? "0", 10) + 1;
  if (count >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
    localStorage.removeItem(ATTEMPT_KEY);
  } else {
    localStorage.setItem(ATTEMPT_KEY, String(count));
  }
}

function clearAttempts(): void {
  localStorage.removeItem(LOCKOUT_KEY);
  localStorage.removeItem(ATTEMPT_KEY);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AdminAccessPage() {
  const router = useRouter();
  const { user, setSession } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [requireTotp, setRequireTotp]   = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [lockout, setLockout]           = useState(getClientLockout());
  const [mounted, setMounted]           = useState(false);

  const totpRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { ref: registerTotpRef, ...registerTotp } = register("totp");

  // Tick lockout countdown
  useEffect(() => {
    setMounted(true);
    if (!lockout.locked) return;
    const id = setInterval(() => {
      const l = getClientLockout();
      setLockout(l);
      if (!l.locked) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [lockout.locked]);

  // Already logged-in admin → skip straight to dashboard
  useEffect(() => {
    if (user?.role === "admin") router.replace("/control"); 
  }, [user, router]);

  // Focus TOTP input when step 2 appears
  useEffect(() => {
    if (requireTotp) totpRef.current?.focus();
  }, [requireTotp]);

  const onSubmit = async (values: FormValues) => {
    if (lockout.locked) return;

    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/admin/login", {
        email:    values.email,
        password: values.password,
        totp:     values.totp || undefined,
      });

      const { user: authUser, tokens, requires_totp } = response.data.data;

      if (requires_totp && !values.totp) {
        setRequireTotp(true);
        setLoading(false);
        return;
      }

      if (authUser.role !== "admin") {
        setError("Access denied.");
        recordFailedAttempt();
        setLockout(getClientLockout());
        setLoading(false);
        return;
      }

      clearAttempts();
      setSession(authUser, tokens);
      writeTokenCookie(tokens.access_token);
      router.replace("/admin");

    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;

      if (status === 429) {
        setError("Too many attempts. Try again in 15 minutes.");
        localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
        setLockout(getClientLockout());
      } else {
        setError("Invalid credentials. Access denied.");
        recordFailedAttempt();
        setLockout(getClientLockout());
      }
    } finally {
      setLoading(false);
    }
  };

  const formatRemaining = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Scanline texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)",
          backgroundSize: "100% 3px",
        }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow blob */}
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Terminal header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
            <Terminal className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
              Restricted Access
            </p>
            <p className="text-[10px] font-mono text-slate-600 mt-0.5">
              Authorised personnel only
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-amber-500/60" />
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            {requireTotp ? "Step 2 of 2 — Verify" : "Step 1 of 2 — Authenticate"}
          </span>
          <div className={`h-px flex-1 ${requireTotp ? "bg-amber-500/60" : "bg-white/5"}`} />
        </div>

        {/* Lockout warning */}
        {mounted && lockout.locked && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="text-xs font-mono font-semibold text-red-400">LOCKED</p>
              <p className="text-[10px] font-mono text-red-400/70 mt-0.5">
                Too many failed attempts. Retry in {formatRemaining(lockout.remaining)}.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !lockout.locked && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" autoComplete="off">

          {!requireTotp ? (
            <>
              {/* Email */}
              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  Identifier
                </label>
                <input
                  type="email"
                  autoComplete="off"
                  placeholder="name@domain.com"
                  disabled={lockout.locked}
                  className="w-full rounded-lg border border-white/8 bg-white/4 px-4 py-3 font-mono text-sm text-white placeholder-slate-700 outline-none transition-all focus:border-amber-500/40 focus:bg-white/6 focus:ring-1 focus:ring-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] font-mono text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    disabled={lockout.locked}
                    className="w-full rounded-lg border border-white/8 bg-white/4 px-4 py-3 pr-11 font-mono text-sm text-white placeholder-slate-700 outline-none transition-all focus:border-amber-500/40 focus:bg-white/6 focus:ring-1 focus:ring-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors p-1"
                    aria-label={showPassword ? "Hide" : "Show"}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[10px] font-mono text-red-400">{errors.password.message}</p>
                )}
              </div>
            </>
          ) : (
            /* TOTP step */
            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                Authenticator Code
              </label>
              <input
                ref={(el) => {
                  registerTotpRef(el);
                  totpRef.current = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                disabled={lockout.locked}
                className="w-full rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3.5 font-mono text-2xl tracking-[0.4em] text-amber-300 placeholder-amber-900 outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 text-center disabled:opacity-40"
                {...registerTotp}
              />
              <p className="mt-2 text-[10px] font-mono text-slate-600 text-center">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || lockout.locked}
            className="mt-2 w-full rounded-lg border border-amber-500/30 bg-amber-500/10 py-3 font-mono text-sm font-bold text-amber-400 tracking-widest uppercase transition-all hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                Verifying...
              </span>
            ) : requireTotp ? (
              "Confirm Identity"
            ) : (
              "Request Access →"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
            Unauthorised access is prohibited
          </p>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Attempt counter */}
        {mounted && !lockout.locked && (
          <p className="mt-3 text-center text-[9px] font-mono text-slate-800">
            {parseInt(localStorage.getItem(ATTEMPT_KEY) ?? "0", 10) > 0 && (
              `${parseInt(localStorage.getItem(ATTEMPT_KEY) ?? "0", 10)} of ${MAX_ATTEMPTS} attempts used`
            )}
          </p>
        )}
      </div>
    </div>
  );
}