
"use client";

import { Compass, Building2, ArrowRight } from "lucide-react";

type AuthRole = "tourist" | "provider";

type RoleSelectorProps = {
  value: AuthRole | null;
  onChange: (value: AuthRole) => void;
};

const roles = [
  {
    value: "tourist" as AuthRole,
    label: "Tourist",
    description: "Discover experiences, follow cultural sites, and book authentic packages.",
    icon: Compass,
    tags: ["Explore", "Book", "Follow"],
  },
  {
    value: "provider" as AuthRole,
    label: "Provider",
    description: "Share your cultural site, publish experiences, create packages and manage bookings.",
    icon: Building2,
    tags: ["Publish", "Manage", "Grow"],
  },
];

export function RoleSelector({ onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {roles.map((role) => (
        <button
          key={role.value}
          type="button"
          onClick={() => onChange(role.value)}
          className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-amber-400/50 hover:bg-white/15 hover:shadow-xl hover:shadow-amber-400/5 hover:-translate-y-0.5"
        >
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-amber-400/5 to-transparent pointer-events-none" />

          {/* Icon */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 group-hover:bg-amber-400/30 transition-colors">
            <role.icon className="h-6 w-6 text-amber-400" />
          </div>

          {/* Text */}
          <div className="relative flex-1">
            <h3 className="text-base font-bold text-white">{role.label}</h3>
            <p className="mt-1 text-sm text-slate-300 leading-5">{role.description}</p>
          </div>

          {/* Footer */}
          <div className="relative flex w-full items-center justify-between border-t border-white/10 pt-3">
            <div className="flex flex-wrap gap-1.5">
              {role.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:text-amber-400 group-hover:translate-x-0.5" />
          </div>
        </button>
      ))}
    </div>
  );
}

