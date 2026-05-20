import { T } from '../theme';
import { Icon } from './Icon';

export function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'discover', label: 'Descoperă', icon: 'compass' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    { id: 'tickets', label: 'Bilete', icon: 'ticket' },
    { id: 'saved', label: 'Salvate', icon: 'heart' },
    { id: 'account', label: 'Cont', icon: 'user' },
  ];
  const activeIdx = Math.max(0, tabs.findIndex(t => t.id === active));
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 14, zIndex: 30,
      background: 'rgba(20,20,24,0.78)', backdropFilter: 'blur(28px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
      border: `1px solid rgba(255,255,255,0.08)`,
      boxShadow: '0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
      borderRadius: 24,
      padding: 6,
      display: 'flex', gap: 2,
      position: 'absolute',
    }}>
      {/* Sliding active indicator */}
      <div aria-hidden style={{
        position: 'absolute',
        top: 6, bottom: 6,
        left: `calc(6px + ${activeIdx} * ((100% - 12px) / ${tabs.length}))`,
        width: `calc((100% - 12px) / ${tabs.length})`,
        background: `linear-gradient(180deg, ${T.brand}, ${T.brandSoft})`,
        borderRadius: 18,
        boxShadow: '0 8px 20px rgba(91,30,220,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
        transition: 'left 360ms cubic-bezier(0.2,0,0,1), background 240ms',
      }} />

      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange?.(t.id)} aria-label={t.label} aria-pressed={isActive} style={{
            position: 'relative', zIndex: 1,
            flex: 1, border: 0,
            background: 'transparent',
            color: isActive ? '#fff' : T.fg3,
            borderRadius: 18, padding: '10px 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            cursor: 'pointer',
            transition: 'color 200ms cubic-bezier(0.2,0,0,1)',
          }}>
            <span style={{
              display: 'inline-flex',
              transform: isActive ? 'translateY(-1px) scale(1.06)' : 'translateY(0) scale(1)',
              transition: 'transform 280ms cubic-bezier(0.2,0,0,1)',
            }}>
              <Icon name={t.icon} size={19} />
            </span>
            <span style={{
              fontFamily: T.font, fontWeight: isActive ? 700 : 500, fontSize: 10,
              letterSpacing: '-0.01em',
              opacity: isActive ? 1 : 0.85,
              transition: 'opacity 200ms',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SectionHeader({ title, sub, count, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 18,
          letterSpacing: '-0.02em', color: '#fff',
          display: 'flex', alignItems: 'baseline', gap: 8,
        }}>
          {title}
          {count !== undefined && (
            <span style={{ fontFamily: T.fontInter, fontWeight: 500, fontSize: 12, color: T.fg4 }}>{count}</span>
          )}
        </div>
        {sub && <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg4, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} style={{
          background: 'transparent', border: 0, padding: 0,
          fontFamily: T.font, fontWeight: 600, fontSize: 12, color: T.fg3,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2,
        }}>{action} <Icon name="chevronRight" size={12} /></button>
      )}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: T.fontInter, fontSize: 11, fontWeight: 700,
      color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '4px 4px 0',
    }}>{children}</div>
  );
}

export function SheetHeading({ children }) {
  return <h3 style={{
    margin: 0,
    fontFamily: T.fontInter, fontWeight: 700, fontSize: 11,
    color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase',
  }}>{children}</h3>;
}
