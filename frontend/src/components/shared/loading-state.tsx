
export function LoadingState({ label = "CulturalHub" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Pulsing ring */}
      <div className="relative mb-5">
        <div className="absolute -inset-1.5 rounded-[28px] border border-white/10 animate-pulse" />
        <div className="h-[88px] w-[88px] rounded-[22px] bg-white flex items-center justify-center">
          <img src="/logo.jpg" alt="CulturalHub" className="h-[60px] w-[60px] rounded-2xl object-cover" />
        </div>
      </div>

      {/* Label */}
      <p className="text-[11px] font-semibold tracking-[3px] text-white/30 uppercase mb-5">
        {label}
      </p>

      {/* Shimmer bar */}
      <div className="h-0.5 w-12 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-2/5 rounded-full bg-amber-400 animate-[shimmer_1.4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

