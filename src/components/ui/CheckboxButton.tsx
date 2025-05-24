interface CheckboxButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export default function CheckboxButton({
  label,
  icon,
  className,
  title,
  ...props
}: CheckboxButtonProps) {
  return (
    <label title={title} className="flex">
      <input type="checkbox" className="peer hidden" {...props} />
      <span
        className={`button button--checkbox ${label ? 'button--text' : 'button--icon'} ${className}`}
      >
        <span className="relative z-10">{icon || label}</span>
      </span>
    </label>
  );
}
