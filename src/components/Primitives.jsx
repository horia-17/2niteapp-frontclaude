import { T } from '../theme';
import { Icon } from './Icon';

export function Button({ children, variant = 'primary', size = 'md', icon, shape = 'pill', onClick, style = {}, fullWidth }) {
  const base = {
    fontFamily: T.font,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    border: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: shape === 'pill' ? 999 : 12,
    transition: 'all 120ms cubic-bezier(0.2,0,0,1)',
    width: fullWidth ? '100%' : undefined,
  };
  const sizes = {
    sm: { fontSize: 13, padding: '10px 16px', height: 38 },
    md: { fontSize: 15, padding: '14px 22px', height: 50 },
    lg: { fontSize: 17, padding: '18px 28px', height: 60 },
  };
  const variants = {
    primary: { background: T.brand, color: '#fff' },
    secondary: { background: 'transparent', color: '#fff', border: `1px solid ${T.borderStrong}` },
    ghost: { background: 'transparent', color: '#fff' },
    danger: { background: T.error, color: '#fff' },
    soft: { background: 'rgba(167,123,255,0.14)', color: T.brandGlow, border: '1px solid rgba(167,123,255,0.25)' },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
}

export function Badge({ children, kind = 'brand' }) {
  const map = {
    brand: { background: T.brand, color: '#fff', border: 'none' },
    today: { background: '#fff', color: T.bg1, border: 'none' },
    soft: { background: 'rgba(167,123,255,0.15)', color: T.brandGlow, border: '1px solid rgba(167,123,255,0.3)' },
    limited: { background: 'rgba(245,158,11,0.15)', color: T.warning, border: '1px solid rgba(245,158,11,0.3)' },
    sold: { background: 'rgba(239,68,68,0.15)', color: T.error, border: '1px solid rgba(239,68,68,0.3)' },
    new: { background: 'rgba(1,111,208,0.18)', color: '#6BA3E0', border: '1px solid rgba(1,111,208,0.35)' },
    free: { background: 'rgba(34,197,94,0.15)', color: T.success, border: '1px solid rgba(34,197,94,0.3)' },
    pop: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: `1px solid ${T.borderStrong}` },
    age: { background: T.bg2, color: '#fff', border: '1px solid #fff' },
  };
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 700, fontSize: 10,
      padding: '5px 9px', borderRadius: 999,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      ...map[kind],
    }}>{children}</span>
  );
}

export function Chip({ children, active, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: T.font, fontWeight: active ? 700 : 500, fontSize: 13,
      padding: '8px 14px', borderRadius: 999,
      border: active ? `1px solid ${T.brand}` : `1px solid ${T.borderStrong}`,
      background: active ? T.brand : 'transparent', color: '#fff',
      display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 120ms',
    }}>
      {children}
      {icon && <Icon name={icon} size={13} />}
    </button>
  );
}

export function Input({ label, value, placeholder, type = 'text', error, helper, onChange, leading, trailing }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <label style={{ fontFamily: T.font, fontWeight: 500, fontSize: 13, color: '#fff' }}>{label}</label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        borderRadius: 10, padding: '14px 16px',
        border: `1px solid ${error ? T.error : T.borderStrong}`,
        background: value ? 'linear-gradient(#27272A, #3F3F46)' : 'transparent',
        color: value ? '#fff' : T.fg3,
        fontFamily: T.fontInter, fontSize: 15,
      }}>
        {leading && <Icon name={leading} size={18} color={T.fg3} />}
        <input
          type={type}
          value={value || ''}
          placeholder={placeholder}
          onChange={onChange}
          style={{
            flex: 1, background: 'transparent', border: 0, outline: 'none',
            color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit',
          }}
        />
        {trailing && <Icon name={trailing} size={18} color={T.fg3} />}
      </div>
      {(helper || error) && (
        <div style={{
          fontFamily: T.fontInter, fontSize: 11,
          color: error ? T.error : T.fg4,
        }}>{error || helper}</div>
      )}
    </div>
  );
}

export function TopBar({ title, leading, trailing, large }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: large ? '16px 20px 8px' : '12px 20px',
      gap: 12,
    }}>
      {leading || <div style={{ width: 36 }} />}
      <div style={{
        flex: 1,
        fontFamily: T.font,
        fontWeight: large ? 800 : 700,
        fontSize: large ? 28 : 17,
        letterSpacing: '-0.02em',
        color: '#fff',
        textAlign: large ? 'left' : 'center',
      }}>{title}</div>
      {trailing || <div style={{ width: 36 }} />}
    </div>
  );
}

export function IconBtn({ name, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: 999,
      background: T.bg2, border: `1px solid ${T.border}`,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', cursor: 'pointer',
    }}>
      <Icon name={name} size={18} />
      {badge && (
        <span style={{
          position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 999,
          background: T.brand, border: `2px solid ${T.bg2}`, boxSizing: 'content-box',
        }} />
      )}
    </button>
  );
}

export const topIconStyle = {
  width: 38, height: 38, borderRadius: 999,
  background: T.bg2, border: `1px solid ${T.border}`,
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
};

export const iconBtnGlassStyle = {
  width: 40, height: 40, borderRadius: 999,
  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
};
