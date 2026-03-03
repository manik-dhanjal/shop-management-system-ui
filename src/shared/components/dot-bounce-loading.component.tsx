interface DotBounceLoadingProps {
  /** Size of each dot (Tailwind width/height class) */
  size?: "w-0.5" | "w-1" | "w-1.5" | "w-2" | "w-2.5" | "w-3";
  /** Color of dots (Tailwind bg color class) */
  color?: string;
  /** Spacing between dots (Tailwind space class) */
  spacing?: "space-x-1" | "space-x-2" | "space-x-3";
  /** Number of dots to display */
  dotCount?: number;
  /** Custom className for the container */
  className?: string;
}

export const DotBounceLoading = ({
  size = "w-1",
  color = "bg-violet-500",
  spacing = "space-x-2",
  dotCount = 3,
  className = "",
}: DotBounceLoadingProps) => {
  const sizeClass = size;
  const heightClass = size.replace("w-", "h-");
  const animationDelays = ["-0.3s", "-0.15s", "0s"];

  const bounceStyle = `
    @keyframes bounce-high {
      0%, 100% {
        transform: translateY(-60%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(60%);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `;

  return (
    <>
      <style>{bounceStyle}</style>
      <div className={`flex ${spacing} ${className}`}>
        {Array.from({ length: dotCount }).map((_, index) => (
          <div
            key={index}
            className={`${sizeClass} ${heightClass} ${color} rounded-full`}
            style={{
              animation: "bounce-high 1s infinite",
              animationDelay: animationDelays[index % animationDelays.length],
            }}
          />
        ))}
      </div>
    </>
  );
};
