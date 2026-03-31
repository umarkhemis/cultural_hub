
"use client";

import { Compass, Building2 } from "lucide-react";
import { cn } from "@/src/utils/cn";

type AuthRole = "tourist" | "provider";

type RoleSelectorProps = {
  value: AuthRole;
  onChange: (value: AuthRole) => void;
};

const roles = [
  {
    value: "tourist" as AuthRole,
    label: "Tourist",
    description: "Explore & book experiences",
    icon: Compass,
  },
  {
    value: "provider" as AuthRole,
    label: "Provider",
    description: "Share your cultural site",
    icon: Building2,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = value === role.value;

        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={cn(
              "relative flex flex-col items-start gap-1.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200",
              isActive
                ? "border-amber-400/50 bg-amber-400/10 ring-2 ring-amber-400/20"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
            )}
          >
            {/* Active dot indicator */}
            <div
              className={cn(
                "absolute right-3 top-3 h-2 w-2 rounded-full transition-all duration-200",
                isActive ? "bg-amber-400 scale-100" : "bg-transparent scale-0"
              )}
            />

            <Icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isActive ? "text-amber-400" : "text-slate-500"
              )}
            />

            <div>
              <p
                className={cn(
                  "text-sm font-semibold leading-tight transition-colors duration-200",
                  isActive ? "text-black" : "text-slate-400"
                )}
              >
                {role.label}
              </p>
              <p
                className={cn(
                  "text-[11px] leading-tight mt-0.5 transition-colors duration-200",
                  isActive ? "text-amber-400/70" : "text-slate-600"
                )}
              >
                {role.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}




























// "use client";

// import { cn } from "@/src/utils/cn";

// type AuthRole = "tourist" | "provider";

// type RoleSelectorProps = {
//   value: AuthRole;
//   onChange: (value: AuthRole) => void;
// };

// export function RoleSelector({ value, onChange }: RoleSelectorProps) {
//   return (
//     <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
//       <button
//         type="button"
//         onClick={() => onChange("tourist")}
//         className={cn(
//           "rounded-xl px-4 py-3 text-sm font-medium transition",
//           value === "tourist"
//             ? "bg-white text-slate-900 shadow-sm"
//             : "text-slate-600 hover:text-slate-900"
//         )}
//       >
//         Tourist
//       </button>

//       <button
//         type="button"
//         onClick={() => onChange("provider")}
//         className={cn(
//           "rounded-xl px-4 py-3 text-sm font-medium transition",
//           value === "provider"
//             ? "bg-white text-slate-900 shadow-sm"
//             : "text-slate-600 hover:text-slate-900"
//         )}
//       >
//         Cultural Service Provider
//       </button>
//     </div>
//   );
// }