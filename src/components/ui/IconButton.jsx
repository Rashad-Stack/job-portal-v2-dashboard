import { clsx } from "clsx"

export const IconButton = ({
  icon: Icon,
  size = 16,
  strokeWidth = 2,
  className,
  iconClassName,
  variant = "circle",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "p-2 hover:bg-zinc-100",
        variant === "circle" ? "rounded-full" : "rounded",
        className
      )}
      {...props}
    >
      <Icon size={size} strokeWidth={strokeWidth} className={iconClassName} />
    </button>
  )
}
