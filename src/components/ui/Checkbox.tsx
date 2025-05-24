interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  margin?: string;
  ref?: React.RefObject<HTMLInputElement | null>;
}

export default function Checkbox({ margin, ref, ...props }: CheckboxProps) {
  return (
    <div className={`relative size-4 shrink-0 ${margin}`}>
      <input
        ref={ref}
        className="peer absolute size-full appearance-none border-1 bg-linear-to-r from-slate-900/80 from-30% to-cyan-900/60 checked:border-blue-500 checked:bg-blue-500 checked:bg-none indeterminate:border-blue-500 indeterminate:bg-blue-500 indeterminate:bg-none hover:border-emerald-200 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0 focus:outline-none disabled:border-slate-400/50 disabled:bg-slate-400/40 disabled:bg-none"
        {...props}
      />

      {/* Ícone de check quando está marcado */}
      <svg
        className="pointer-events-none absolute left-0 z-10 hidden size-4 p-[1px] text-white peer-checked:block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>

      {/* Ícone de indeterminado */}
      <svg
        className="pointer-events-none absolute left-0 z-10 hidden size-4 p-[2px] text-white peer-indeterminate:block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
  );
}
