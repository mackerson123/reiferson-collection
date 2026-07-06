interface LoadingIntroProps {
  exiting: boolean;
}

export default function LoadingIntro({ exiting }: LoadingIntroProps) {
  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#F1EFE7] transition-opacity duration-500 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="loading-ball-float">
        <svg
          className="loading-ball-spin"
          width="64"
          height="64"
          viewBox="0 0 100 100"
        >
          <defs>
            <clipPath id="loading-ball-clip">
              <circle cx="50" cy="50" r="43" />
            </clipPath>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M26 11 C48 34 48 66 26 89"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M74 11 C52 34 52 66 74 89"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <g clipPath="url(#loading-ball-clip)">
            <path
              d="M26 11 C48 34 48 66 26 89"
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              strokeDasharray="1.5 8"
            />
            <path
              d="M74 11 C52 34 52 66 74 89"
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              strokeDasharray="1.5 8"
            />
          </g>
        </svg>
      </div>
      <div className="loading-ball-shadow mt-3 h-1.5 w-10 rounded-full bg-black/25 blur-[2px]"></div>
    </div>
  );
}
