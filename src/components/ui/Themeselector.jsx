import { useTheme, THEMES } from '../../contexts/ThemeContext'

export default function ThemeSelector() {
  const { themeName, setTheme } = useTheme()

  return (
    <div>
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
        Colour Theme
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {Object.entries(THEMES).map(([key, t]) => (
          <button key={key} onClick={() => setTheme(key)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 8px', borderRadius: '12px', border: `2px solid ${themeName === key ? t.secondary : '#F1F5F9'}`, background: themeName === key ? `${t.secondary}15` : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
              {t.emoji}
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: themeName === key ? t.secondary : '#94A3B8' }}>
              {t.name}
            </span>
            {themeName === key && (
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.secondary }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
