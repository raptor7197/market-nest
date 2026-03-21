const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-200 hover:border-slate'
        } bg-white`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
