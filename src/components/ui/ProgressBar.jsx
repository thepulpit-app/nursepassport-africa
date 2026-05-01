export default function ProgressBar({ value = 0, max = 100, label, showPercent = true, color = 'teal', height = 'md' }) {
  const percent = Math.round((value / max) * 100)

  const colors = {
    teal: 'bg-[#00897B]',
    gold: 'bg-[#F4A300]',
    navy: 'bg-[#0A2540]',
    green: 'bg-green-500',
  }

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-[#0A2540]">{label}</span>}
          {showPercent && <span className="text-sm font-semibold text-[#64748B]">{percent}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className={`${heights[height]} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
