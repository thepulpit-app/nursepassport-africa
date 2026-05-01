export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  disabled = false, loading = false,
  fullWidth = false, className = ''
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-[#00897B] text-white hover:bg-[#00796B] focus:ring-[#00897B] shadow-sm hover:shadow-md',
    secondary: 'bg-[#0A2540] text-white hover:bg-[#0D3060] focus:ring-[#0A2540] shadow-sm hover:shadow-md',
    outline:   'border-2 border-[#0A2540] text-[#0A2540] hover:bg-[#0A2540] hover:text-white focus:ring-[#0A2540]',
    ghost:     'text-[#0A2540] hover:bg-gray-100 focus:ring-gray-200',
    gold:      'bg-[#F4A300] text-[#0A2540] hover:bg-[#E59400] focus:ring-[#F4A300] shadow-sm hover:shadow-md font-bold',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  )
}
