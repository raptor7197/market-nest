const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary:
      'bg-burnt text-white shadow-[0_12px_30px_rgba(201,79,36,0.22)] hover:bg-burnt-600 hover:-translate-y-0.5 focus:ring-burnt',
    secondary:
      'bg-charcoal text-white shadow-[0_12px_30px_rgba(23,23,23,0.16)] hover:bg-charcoal-700 hover:-translate-y-0.5 focus:ring-charcoal',
    outline:
      'border border-gray-200 bg-white text-charcoal hover:border-burnt hover:text-burnt hover:-translate-y-0.5 focus:ring-burnt',
    danger:
      'bg-red-600 text-white shadow-[0_12px_30px_rgba(220,38,38,0.2)] hover:bg-red-700 hover:-translate-y-0.5 focus:ring-red-500',
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
          Saving...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
