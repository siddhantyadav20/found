const STAR = "m8 0 2.35 5.2 5.65.62-4.2 3.82 1.17 5.56L8 12.36 3.03 15.2 4.2 9.64 0 5.82l5.65-.62L8 0Z";
const HALF_STAR = "M8 0v12.36L3.03 15.2 4.2 9.64 0 5.82l5.65-.62L8 0Z";

export default function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 108 16" fill="currentColor" role="img" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${i * 23})`}>
          <path d={STAR} fillOpacity={i + 1 <= value ? 1 : 0.25} />
          {i < value && i + 1 > value && <path d={HALF_STAR} />}
        </g>
      ))}
    </svg>
  );
}
