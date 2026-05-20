import { useMemo, useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Badge, iconBtnGlassStyle } from '../components/Primitives';
import { useApp } from '../state';

function InfoRow({ icon, label, value, action, actionStyle, last, onClick, onActionClick }) {
  return (
    <div onClick={onClick} className={onClick ? 'press' : ''} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: T.bg3, color: T.brandGlow,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontFamily: T.font, fontWeight: 500, fontSize: 14, color: '#fff' }}>{value}</div>
      </div>
      {action && (
        <button onClick={(e) => { e.stopPropagation(); onActionClick?.(); }} style={{
          background: 'transparent', border: 'none',
          fontFamily: T.font, fontWeight: 600, fontSize: 12,
          color: actionStyle === 'brand' ? T.brandGlow : T.fg2,
          cursor: 'pointer',
        }}>{action}</button>
      )}
    </div>
  );
}

function qtyBtn(disabled, primary) {
  return {
    width: 32, height: 32, borderRadius: 999,
    background: primary ? T.brand : T.bg3,
    border: 'none', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  };
}

function TicketTypeRow({ ticket, qty, onChange }) {
  const soldOut = ticket.badge?.kind === 'sold';
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${qty > 0 ? T.brand : T.border}`,
      borderRadius: 14, padding: 16,
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'border-color 120ms',
      opacity: soldOut ? 0.5 : 1,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: '#fff' }}>{ticket.name}</div>
          {ticket.badge && <Badge kind={ticket.badge.kind}>{ticket.badge.label}</Badge>}
        </div>
        <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>{ticket.sub}</div>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', marginTop: 2 }}>
          {ticket.price} <span style={{ fontSize: 12, fontWeight: 500, color: T.fg3 }}>RON</span>
        </div>
      </div>
      {!soldOut && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => onChange(Math.max(0, qty - 1))} style={qtyBtn(qty === 0)} disabled={qty === 0}>
            <Icon name="minus" size={14} />
          </button>
          <div style={{ width: 24, textAlign: 'center', fontFamily: T.font, fontWeight: 700, fontSize: 16, color: '#fff' }}>{qty}</div>
          <button onClick={() => onChange(qty + 1)} style={qtyBtn(false, true)}>
            <Icon name="plus" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export function EventDetailScreen({ event, onBack, onCheckout, onOpenOrganizer, onOpenMap, onShare }) {
  const { saved, toggleSaved, showToast } = useApp();
  const isSaved = saved.has(event.id);

  const [qtys, setQtys] = useState(() =>
    event.tickets.map(t => (t.badge?.kind === 'sold' ? 0 : (t.qty || 0)))
  );
  const [expanded, setExpanded] = useState(false);

  const totalCount = qtys.reduce((s, n) => s + n, 0);
  const subtotal = useMemo(() =>
    event.tickets.reduce((s, t, i) => s + qtys[i] * t.price, 0)
  , [event.tickets, qtys]);

  const handleBuy = () => {
    if (totalCount === 0) { showToast('Alege cel puțin un bilet.'); return; }
    const items = event.tickets
      .map((t, i) => ({ name: t.name, price: t.price, qty: qtys[i] }))
      .filter(i => i.qty > 0);
    onCheckout(event, items);
  };

  const description = event.description || '';
  const longDescription = description + ' Locul este iluminat editorial, sound system Funktion-One, doors deschise la 21:00 cu set de încălzire de la rezidenți. Acces minim 18 ani — cu act de identitate la intrare. Garderoba este inclusă în preț.';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 120 }}>
        <div style={{
          position: 'relative', width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${event.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 140,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0))',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 280,
            background: 'linear-gradient(to top, rgba(18,18,18,1) 0%, rgba(18,18,18,0.95) 22%, rgba(18,18,18,0.5) 60%, rgba(18,18,18,0) 100%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 56, left: 16, right: 16,
            display: 'flex', justifyContent: 'space-between', zIndex: 3,
          }}>
            <button onClick={onBack} style={iconBtnGlassStyle}><Icon name="chevronLeft" size={18} /></button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onShare} style={iconBtnGlassStyle}><Icon name="share" size={18} /></button>
              <button onClick={() => { toggleSaved(event.id); showToast(isSaved ? 'Eliminat din Salvate' : 'Adăugat în Salvate'); }} style={iconBtnGlassStyle}>
                <Icon name={isSaved ? 'heartFilled' : 'heart'} size={18} color={isSaved ? T.brandGlow : '#fff'} />
              </button>
            </div>
          </div>
          {(event.badges?.length > 0) && (
            <div style={{
              position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 6, zIndex: 3, maxWidth: 200, flexWrap: 'wrap', justifyContent: 'center',
            }}>
              {event.badges?.map((b, i) => <Badge key={i} kind={b.kind}>{b.label}</Badge>)}
            </div>
          )}

          <div style={{
            position: 'absolute', left: 20, right: 20, bottom: 24, zIndex: 3,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {event.genre && (
              <div style={{
                fontFamily: T.fontInter, fontSize: 11, color: T.brandGlow, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>{event.genre}</div>
            )}
            <h1 style={{
              margin: 0,
              fontFamily: T.font, fontWeight: 800, fontSize: 28, lineHeight: 1.08,
              letterSpacing: '-0.02em', color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.55)',
              wordBreak: 'break-word', overflowWrap: 'break-word',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{event.title}</h1>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg2 }}>
              {event.artist}
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{
            background: T.bg2, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: '4px 16px',
          }}>
            <InfoRow icon="calendar" label="Data și ora" value={event.date} />
            <InfoRow icon="mapPin" label="Locație" value={`${event.venue} · ${event.address}`}
              action="Vezi pe hartă" onActionClick={onOpenMap} />
            <InfoRow icon="user" label="Organizator"
              value={`${event.organizer} · ${event.organizerFollowers} urmăritori`}
              action="Profil" actionStyle="brand"
              onClick={() => onOpenOrganizer(event)}
              onActionClick={() => onOpenOrganizer(event)} />
            <InfoRow icon="shield" label="Plată securizată" value="Bilet electronic livrat instant" last />
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px', fontFamily: T.font, fontWeight: 700, fontSize: 17, color: '#fff' }}>Despre eveniment</h3>
            <p style={{ margin: 0, fontFamily: T.fontInter, fontSize: 14, color: T.fg2, lineHeight: 1.5 }}>
              {expanded ? longDescription : description}
            </p>
            <button onClick={() => setExpanded(!expanded)} style={{
              background: 'transparent', border: 'none', padding: '8px 0',
              fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.brandGlow,
              cursor: 'pointer',
            }}>{expanded ? 'Mai puțin ←' : 'Vezi mai mult →'}</button>
          </div>

          <div>
            <h3 style={{ margin: '0 0 12px', fontFamily: T.font, fontWeight: 700, fontSize: 17, color: '#fff' }}>Tipuri de bilete</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {event.tickets.map((t, i) => (
                <TicketTypeRow key={t.name} ticket={t} qty={qtys[i]}
                  onChange={(n) => setQtys(prev => prev.map((q, j) => i === j ? n : q))} />
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: 14,
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 12,
          }}>
            <Icon name="shield" size={18} color={T.success} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: '#fff' }}>Plată securizată prin Stripe</div>
              <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>Returnări gestionate de organizator în caz de anulare.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'linear-gradient(to top, rgba(18,18,18,1) 60%, rgba(18,18,18,0))',
        padding: '20px 16px 24px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: T.bg2, border: `1px solid ${T.border}`,
          borderRadius: 18, padding: 8,
        }}>
          <div style={{ paddingLeft: 12, flex: '0 0 auto' }}>
            <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4 }}>
              {totalCount > 0 ? `${totalCount} ${totalCount === 1 ? 'bilet' : 'bilete'}` : 'De la'}
            </div>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1 }}>
              {totalCount > 0 ? `${subtotal} RON` : `${event.price} RON`}
            </div>
          </div>
          <button onClick={handleBuy} style={{
            flex: 1, background: T.brand, color: '#fff', border: 0,
            borderRadius: 14, padding: '14px 16px',
            fontFamily: T.font, fontWeight: 700, fontSize: 15,
            letterSpacing: '-0.01em', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 8px 24px rgba(91,30,220,0.4)',
          }}>
            {totalCount > 0 ? 'Continuă' : 'Cumpără bilet'}
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
