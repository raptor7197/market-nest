const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-charcoal">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-charcoal shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-burnt focus:outline-none focus:ring-4 focus:ring-burnt/10 ${
          error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
