interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Radio({ label, ...props }: RadioProps) {
  return (
    <label htmlFor={props.id} className="relative w-full">
      <input className="peer hidden" type="radio" id={props.id} {...props} />
      <span className="block border text-center font-semibold peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:text-neutral-900 hover:bg-neutral-700/50 peer-checked:hover:bg-emerald-500">
        {label}
      </span>
    </label>
  );
}
