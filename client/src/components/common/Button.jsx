const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles = 'px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-burnt text-white hover:bg-burnt-600 focus:ring-burnt hover:shadow-lg',
    secondary: 'bg-charcoal text-white hover:bg-charcoal-600 focus:ring-charcoal',
    outline: 'border-2 border-burnt text-burnt hover:bg-burnt hover:text-white focus:ring-burnt',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
