
export function LoadingState({ label = "CulturalHub" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">

      {/* Outer ambient glow ring — slow pulse */}
      <div className="relative flex items-center justify-center mb-8">

        {/* Glow layers */}
        <div className="absolute h-48 w-48 rounded-full bg-orange-500/10 animate-ping" style={{ animationDuration: "2.4s" }} />
        <div className="absolute h-36 w-36 rounded-full bg-teal-500/10 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />

        {/* Rotating dashed ring */}
        <div className="absolute h-32 w-32 rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: "8s" }} />

        {/* Static ring */}
        <div className="absolute h-28 w-28 rounded-full border border-white/5" />

        {/* Logo container */}
        {/* <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-black shadow-2xl"> */}
          {/* Inner subtle border */}
          {/* <div className="absolute inset-0 rounded-3xl border border-white/10" /> */}

          {/* The actual logo — large and crisp */}
          <img
              src="/mock/logo_cultural_hub-bg.png"
              alt="CulturalHub"
              className="h-30 w-30 object-contain shrink-0"
              style={{ imageRendering: "crisp-edges" }}
            />
        {/* </div> */}
      </div>

      {/* Brand name */}
      {/* <p className="text-lg font-bold tracking-widest text-white mb-1">
        CulturalHub
      </p> */}
      {/* <span
        className="text-sm font-bold tracking-wide"
        style={{ color: "#f97316" }}   
        >
          CulturalHub
      </span> */}

      {/* Sub-label */}
      <p className="text-[10px] font-medium tracking-[4px] text-white/25 uppercase mb-8">
        {label === "CulturalHub" ? "Discover · Connect · Experience" : label}
      </p>

      {/* Animated progress bar */}
      <div className="relative h-0.5 w-24 rounded-full overflow-hidden bg-white/8">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "40%",
            background: "linear-gradient(90deg, #f97316, #14b8a6)",
            animation: "loading-slide 1.6s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes loading-slide {
          0%   { transform: translateX(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(350%); opacity: 0; }
        }
      `}</style>

    </div>
  );
}


