interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
}

export default function Button({
  label,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`button button--toggle ${label ? 'button--text' : 'button--icon'} ${className}`}
    >
      <span className="relative z-10">{icon || label}</span>
    </button>
  );
}
