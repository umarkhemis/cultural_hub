
export function LoadingState({ label = "CulturalHub" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">

      {/* Spinning logo */}
      <div className="mb-3 animate-spin" style={{ animationDuration: "2s", animationTimingFunction: "linear" }}>
        <img
          src="/mock/logo_cultural_hub-bg.png"
          alt="CulturalHub"
          className="h-28 w-28 object-contain"
        />
      </div>

      {/* Sub-label */}
      <p className="text-[10px] font-medium tracking-[4px] text-white/25 uppercase mb-6">
        {label === "CulturalHub" ? "Discover · Connect · Experience" : label}
      </p>

      {/* Progress bar */}
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


























// export function LoadingState({ label = "CulturalHub" }: { label?: string }) {
//   return (
//     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">

//       {/* Spinning logo */}
//       <div className="mb-8 animate-spin" style={{ animationDuration: "2s", animationTimingFunction: "linear" }}>
//         <img
//           src="/mock/logo_cultural_hub-bg.png"
//           alt="CulturalHub"
//           className="h-20 w-20 object-contain"
//         />
//       </div>

//       {/* Sub-label */}
//       <p className="text-[10px] font-medium tracking-[4px] text-white/25 uppercase mb-8">
//         {label === "CulturalHub" ? "Discover · Connect · Experience" : label}
//       </p>

//       {/* Progress bar */}
//       <div className="relative h-0.5 w-24 rounded-full overflow-hidden bg-white/8">
//         <div
//           className="absolute inset-y-0 left-0 rounded-full"
//           style={{
//             width: "40%",
//             background: "linear-gradient(90deg, #f97316, #14b8a6)",
//             animation: "loading-slide 1.6s ease-in-out infinite",
//           }}
//         />
//       </div>

//       <style>{`
//         @keyframes loading-slide {
//           0%   { transform: translateX(-100%); opacity: 0; }
//           20%  { opacity: 1; }
//           80%  { opacity: 1; }
//           100% { transform: translateX(350%); opacity: 0; }
//         }
//       `}</style>

//     </div>
//   );
// }

