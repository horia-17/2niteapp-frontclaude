import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Button, iconBtnGlassStyle } from '../components/Primitives';
import { useApp } from '../state';

const ICONS = {
  reminder: { name: 'clock', color: T.brandGlow, bg: 'rgba(167,123,255,0.16)' },
  drop: { name: 'ticket', color: T.warning, bg: 'rgba(245,158,11,0.16)' },
  follow: { name: 'user', color: T.success, bg: 'rgba(34,197,94,0.16)' },
  system: { name: 'shield', color: T.fg2, bg: 'rgba(255,255,255,0.06)' },
};

function NotificationRow({ n, onOpen, onDismiss }) {
  const meta = ICONS[n.kind] || ICONS.system;
  return (
    <div onClick={onOpen} className="press" style={{
      display: 'flex', gap: 12, padding: '14px 16px',
      background: n.unread ? 'rgba(91,30,220,0.08)' : 'transparent',
      borderRadius: 14, cursor: 'pointer',
      border: `1px solid ${n.unread ? 'rgba(91,30,220,0.18)' : T.border}`,
      position: 'relative',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: meta.bg, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={meta.name} size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff',
            letterSpacing: '-0.01em', flex: 1, minWidth: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{n.title}</div>
          {n.unread && <span style={{ width: 7, height: 7, borderRadius: 999, background: T.brand, flexShrink: 0 }} />}
        </div>
        <div style={{
          fontFamily: T.fontInter, fontSize: 12, color: T.fg2, marginTop: 2,
          lineHeight: 1.4,
        }}>{n.body}</div>
        <div style={{
          fontFamily: T.fontInter, fontSize: 10, color: T.fg4,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6,
        }}>{n.when}</div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className="press" style={{
        width: 28, height: 28, borderRadius: 999, background: 'transparent',
        border: 0, color: T.fg4, cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
      }}><Icon name="x" size={14} /></button>
    </div>
  );
}

export function NotificationsScreen({ onBack, onOpenEvent }) {
  const { notifications, markAllRead, removeNotification } = useApp();
  const unread = notifications.filter(n => n.unread).length;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 24 }}>
        <div style={{
          padding: '54px 16px 16px', position: 'relative',
          minHeight: 56,
        }}>
          <button onClick={onBack} style={{
            ...iconBtnGlassStyle, position: 'absolute', left: 16, top: 54,
          }}><Icon name="chevronLeft" size={18} /></button>
          <div style={{ textAlign: 'center', padding: '0 92px' }}>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>Notificări</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg3, marginTop: 2 }}>
              {unread > 0 ? `${unread} necitite` : 'Totul citit'}
            </div>
          </div>
          <button onClick={markAllRead} disabled={unread === 0} style={{
            position: 'absolute', right: 12, top: 60,
            background: 'transparent', border: 0, padding: '8px 4px',
            cursor: unread === 0 ? 'default' : 'pointer',
            fontFamily: T.font, fontWeight: 600, fontSize: 12,
            color: unread === 0 ? T.fg4 : T.brandGlow,
            opacity: unread === 0 ? 0.5 : 1,
          }}>Marchează tot</button>
        </div>

        {notifications.length === 0 ? (
          <div style={{ padding: '56px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 999, background: T.bg2, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.fg3,
            }}><Icon name="bell" size={26} /></div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 17, color: '#fff' }}>Niciuna nouă</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, maxWidth: 240 }}>
              Vei primi notificări pentru evenimentele salvate și ofertele organizatorilor pe care îi urmărești.
            </div>
            <Button onClick={onBack} size="sm" variant="soft" icon="compass">Descoperă evenimente</Button>
          </div>
        ) : (
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map(n => (
              <NotificationRow
                key={n.id}
                n={n}
                onOpen={() => n.eventId ? onOpenEvent(n.eventId) : null}
                onDismiss={() => removeNotification(n.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
