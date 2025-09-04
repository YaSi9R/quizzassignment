export const Card = ({ children, className = "" }) => (
  <div className={`bg-card rounded-xl border border-border shadow-lg backdrop-blur-sm animate-slide-in ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = "" }) => <div className={`p-8 pb-6 ${className}`}>{children}</div>

export const CardContent = ({ children, className = "" }) => <div className={`p-8 pt-0 ${className}`}>{children}</div>

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-bold leading-none tracking-tight text-card-foreground ${className}`}>{children}</h3>
)

export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow ",
    outline: "border-2 border-border bg-card hover:bg-muted hover:text-card-foreground",
    ghost: "hover:bg-muted hover:text-card-foreground",
  }

  const sizes = {
    default: "h-12 py-3 px-6",
    sm: "h-10 px-4 rounded-lg",
    lg: "h-14 px-8 rounded-xl text-base",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner ${className}`}>
    <div
      className="bg-gradient-to-r from-purple-500 to-slate-300 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
      style={{ width: `${value}%` }}
    />
  </div>
)

export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20 shadow-sm",
    outline: "border-2 border-border text-foreground bg-card/50",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20 shadow-sm",
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export const Select = ({ value, onValueChange, children }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-border rounded-xl bg-input text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {children}
      </select>
    </div>
  )
}

export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>
