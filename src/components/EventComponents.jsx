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
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 14, zIndex: 30,
      background: 'rgba(24,24,27,0.88)', backdropFilter: 'blur(24px)',
      border: `1px solid ${T.border}`,
      borderRadius: 24,
      padding: 6,
      display: 'flex', gap: 2,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange?.(t.id)} style={{
            flex: 1, border: 0,
            background: isActive ? T.brand : 'transparent',
            color: isActive ? '#fff' : T.fg3,
            borderRadius: 18, padding: '10px 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            cursor: 'pointer',
          }}>
            <Icon name={t.icon} size={20} />
            <span style={{
              fontFamily: T.font, fontWeight: isActive ? 700 : 500, fontSize: 10,
              letterSpacing: '-0.01em',
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
