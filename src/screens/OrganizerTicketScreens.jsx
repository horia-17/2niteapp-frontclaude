import { useMemo, useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { iconBtnGlassStyle } from '../components/Primitives';
import { ASSETS } from '../assets';
import { EVENTS, SIDE_EVENTS } from '../data';
import { EventListRow } from './HomeScreen';
import { useApp } from '../state';

function Stat({ value, label }) {
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start',
    }}>
      <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: '#fff' }}>{value}</div>
      <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

const ORGANIZERS = {
  '2nite': {
    name: '2nite', handle: '@2nite.ro',
    bio: 'Cele mai tari evenimente din București. House · Techno · Trap. Casa creativă a scenei locale.',
    followers: '12.353', events: '47', rating: 4.8, image: ASSETS.lalaParty,
    eventIds: ['lala', 'matter', 'fl1', 'fl3'],
  },
  'MATTER': {
    name: 'MATTER', handle: '@matter.bucharest',
    bio: 'Underground techno collective. Open weekends 22:00 → 06:00. Doors policy: no phones on floor.',
    followers: '8.214', events: '32', rating: 4.7, image: ASSETS.night2,
    eventIds: ['matter', 'fl1', 'fl2'],
  },
  'Beach Please': {
    name: 'Beach Please', handle: '@beachplease',
    bio: 'Cel mai mare festival de pe litoral. 3 nopți, 3 scene, peste 30 de artiști.',
    followers: '54.001', events: '12', rating: 4.9, image: ASSETS.search,
    eventIds: ['beach', 'fl4'],
  },
};

export function OrganizerScreen({ organizer, onBack, onOpenEvent, onShare }) {
  const { follows, toggleFollow, showToast } = useApp();
  const [tab, setTab] = useState('upcoming');

  const orgKey = organizer?.organizer || organizer?.name || '2nite';
  const org = ORGANIZERS[orgKey] || ORGANIZERS['2nite'];
  const isFollowing = follows.has(org.name);

  const orgEvents = useMemo(() => {
    const all = [...EVENTS, ...SIDE_EVENTS];
    return org.eventIds.map(id => all.find(e => e.id === id)).filter(Boolean);
  }, [org.eventIds]);

  const past = useMemo(() => orgEvents.slice(1, 3), [orgEvents]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 24 }}>
        <div style={{
          position: 'relative', height: 220,
          background: `url(${org.image}) center/cover, ${T.bg3}`,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(18,18,18,1) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 56, left: 16, right: 16,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <button onClick={onBack} style={iconBtnGlassStyle}><Icon name="chevronLeft" size={18} /></button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onShare} style={iconBtnGlassStyle}><Icon name="share" size={18} /></button>
              <button onClick={() => showToast('Raportare trimisă echipei 2nite')} style={iconBtnGlassStyle}><Icon name="more" size={18} /></button>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px', marginTop: -36, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 18,
              background: `linear-gradient(135deg, ${T.brand}, ${T.brandSoft})`,
              border: `3px solid ${T.bg1}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.font, fontWeight: 800, fontSize: 28, color: '#fff',
              letterSpacing: '-0.04em',
            }}>{org.name.slice(0, 2).toLowerCase()}</div>
            <div style={{ flex: 1, paddingBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1 style={{ margin: 0, fontFamily: T.font, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>{org.name}</h1>
                <span style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: T.brand, color: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={11} strokeWidth={3} />
                </span>
              </div>
              <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3 }}>{org.handle}</div>
            </div>
          </div>

          <p style={{
            margin: '14px 0 0',
            fontFamily: T.fontInter, fontSize: 13, color: T.fg2, lineHeight: 1.45,
          }}>{org.bio}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
            <Stat value={org.followers} label="Urmăritori" />
            <Stat value={org.events} label="Evenimente" />
            <Stat value={`★ ${org.rating}`} label="Rating" />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => { toggleFollow(org.name); showToast(isFollowing ? 'Nu mai urmărești' : 'Acum urmărești'); }} className="press" style={{
              flex: 1, cursor: 'pointer',
              borderRadius: 999, padding: '13px 18px',
              background: isFollowing ? T.bg2 : T.brand,
              color: '#fff',
              border: isFollowing ? `1px solid ${T.borderStrong}` : 'none',
              fontFamily: T.font, fontWeight: 700, fontSize: 14,
              letterSpacing: '-0.01em',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 180ms cubic-bezier(0.2,0,0,1)',
            }}>
              {isFollowing ? <><Icon name="check" size={14} /> Urmărești</> : <>Urmărește</>}
            </button>
            <button onClick={() => showToast('Mesageria deschisă curând')} className="press" style={{
              flex: 1, borderRadius: 999, padding: '13px 18px', cursor: 'pointer',
              background: 'transparent', color: '#fff',
              border: `1px solid ${T.borderStrong}`,
              fontFamily: T.font, fontWeight: 600, fontSize: 14,
            }}>Mesaj</button>
          </div>
        </div>

        <div style={{
          margin: '24px 16px 0', display: 'flex', gap: 0,
          borderBottom: `1px solid ${T.border}`,
        }}>
          {[
            { id: 'upcoming', label: 'Următoare', count: orgEvents.length },
            { id: 'past', label: 'Trecute', count: 43 },
            { id: 'about', label: 'Despre' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="press" style={{
              flex: 1, background: 'transparent', border: 0, padding: '12px 4px',
              borderBottom: tab === t.id ? `2px solid ${T.brand}` : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer',
              fontFamily: T.font, fontWeight: tab === t.id ? 700 : 500, fontSize: 13,
              color: tab === t.id ? '#fff' : T.fg3,
              transition: 'all 180ms cubic-bezier(0.2,0,0,1)',
            }}>
              {t.label}{t.count !== undefined ? ` · ${t.count}` : ''}
            </button>
          ))}
        </div>

        {tab === 'upcoming' && (
          <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {orgEvents.map(e => (
              <EventListRow key={e.id} event={e} onClick={() => onOpenEvent(e)} />
            ))}
          </div>
        )}

        {tab === 'past' && (
          <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {past.map((e, i) => (
              <div key={i} style={{ opacity: 0.6 }}>
                <EventListRow event={e} onClick={() => onOpenEvent(e)} />
              </div>
            ))}
            <div style={{
              marginTop: 12, padding: 14, textAlign: 'center',
              fontFamily: T.fontInter, fontSize: 12, color: T.fg4,
            }}>Total {org.events} evenimente organizate de la lansare.</div>
          </div>
        )}

        {tab === 'about' && (
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: T.fontInter, fontSize: 10, color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Despre</div>
              <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg2, marginTop: 6, lineHeight: 1.5 }}>{org.bio}</div>
            </div>
            <div>
              <div style={{ fontFamily: T.fontInter, fontSize: 10, color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Locație</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: '#fff', marginTop: 4 }}>București, România</div>
            </div>
            <div>
              <div style={{ fontFamily: T.fontInter, fontSize: 10, color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</div>
              <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.brandGlow, marginTop: 4 }}>hello@{org.handle.replace('@', '')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, mono, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan ? '1 / -1' : undefined }}>
      <div style={{
        fontFamily: T.fontInter, fontWeight: 700, fontSize: 9,
        color: T.brand, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        marginTop: 2,
        fontFamily: mono ? T.fontMono : T.font, fontWeight: 600, fontSize: 13,
        color: '#18181B', letterSpacing: mono ? '0.04em' : '-0.01em',
      }}>{value}</div>
    </div>
  );
}

function BigQR({ seed = '' }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const rnd = (x) => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff > x; };
  const N = 25;
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if ((x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8)) continue;
    if (rnd(0.5)) cells.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" />);
  }
  return (
    <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" style={{ width: 200, height: 200, display: 'block' }}>
      <rect width={N} height={N} fill="#fff" />
      <g fill="#18181B">
        <rect x="0" y="0" width="7" height="7" />
        <rect x="1" y="1" width="5" height="5" fill="#fff" />
        <rect x="2" y="2" width="3" height="3" />
        <rect x={N - 7} y="0" width="7" height="7" />
        <rect x={N - 6} y="1" width="5" height="5" fill="#fff" />
        <rect x={N - 5} y="2" width="3" height="3" />
        <rect x="0" y={N - 7} width="7" height="7" />
        <rect x="1" y={N - 6} width="5" height="5" fill="#fff" />
        <rect x="2" y={N - 5} width="3" height="3" />
        {cells}
      </g>
    </svg>
  );
}

export function TicketDetailScreen({ ticket, onBack }) {
  const { showToast } = useApp();
  const t = ticket || {
    title: 'LaLa Party București',
    type: 'General Acces',
    date: 'vineri, 3 octombrie · 21:00',
    venue: 'Reper By ESS',
    address: 'Calea Victoriei 168',
    holder: 'Dumitru Horia-Radu',
    serial: 'NIT2222033002139029',
    code: 'FM8HT9WMAVH7',
    price: 30,
    organizer: '2NITE MEDIA S.R.L.',
    cui: '48557929',
    qrSeed: 'lala-1',
  };
  const [zoomQR, setZoomQR] = useState(false);
  const priceLabel = typeof t.price === 'number' ? `${t.price} RON` : t.price;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', background: '#fff',
      overflow: 'hidden',
      animation: 'ticketIn 280ms cubic-bezier(0.2,0,0,1)',
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}>
        <div style={{
          padding: '52px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={onBack} className="press" style={{
            width: 40, height: 40, borderRadius: 999,
            background: '#F4F4F5', border: 0,
            color: '#18181B', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="chevronLeft" size={18} /></button>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 16, color: '#18181B',
            letterSpacing: '-0.02em',
          }}>2nite</div>
          <button onClick={() => showToast('Opțiuni: descarcă PDF, transferă, raportează')} className="press" style={{
            width: 40, height: 40, borderRadius: 999,
            background: '#F4F4F5', border: 0,
            color: '#18181B', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="more" size={18} /></button>
        </div>

        <div style={{ padding: '8px 24px 18px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: T.fontInter, fontWeight: 700, fontSize: 10,
            color: T.brand, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{t.type} · {t.status === 'used' ? 'Folosit' : 'Bilet valid'}</span>
          <h1 style={{
            margin: '8px 0 0',
            fontFamily: T.font, fontWeight: 800, fontSize: 22, color: '#18181B', letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>{t.title}</h1>
          <div style={{ fontFamily: T.fontInter, fontSize: 13, color: '#52525B', marginTop: 4 }}>
            {t.date}
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1.5px solid #E4E4E7',
            padding: '20px 20px 16px',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div onClick={() => setZoomQR(!zoomQR)} className="press" style={{
                cursor: 'pointer',
                padding: 12, borderRadius: 14, background: '#fff',
                transition: 'transform 200ms cubic-bezier(0.2,0,0,1)',
                transform: zoomQR ? 'scale(1.04)' : 'scale(1)',
              }}>
                <BigQR seed={t.qrSeed} />
              </div>
            </div>

            <div style={{
              fontFamily: T.fontInter, fontSize: 11, textAlign: 'center', color: '#71717A',
              marginBottom: 16,
            }}>Arată acest cod la intrare</div>

            <div style={{
              position: 'relative',
              borderTop: '1.5px dashed #E4E4E7',
              margin: '4px -20px 16px',
            }}>
              <div style={{
                position: 'absolute', top: -10, left: -10, width: 20, height: 20,
                background: T.bg1, borderRadius: 999,
              }} />
              <div style={{
                position: 'absolute', top: -10, right: -10, width: 20, height: 20,
                background: T.bg1, borderRadius: 999,
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <DetailItem label="Holder" value={t.holder} />
              <DetailItem label="Tip bilet" value={t.type} />
              <DetailItem label="Locație" value={t.venue} />
              <DetailItem label="Preț" value={priceLabel} />
              <DetailItem label="Adresa" value={t.address} colSpan />
              <DetailItem label="Serie" value={t.code} mono />
              <DetailItem label="NIT" value={t.serial} mono />
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 16px 6px' }}>
          <button onClick={() => showToast('Adăugat în Apple Wallet')} className="press" style={{
            width: '100%', padding: '14px 18px',
            background: '#18181B', color: '#fff', border: 0,
            borderRadius: 14, cursor: 'pointer',
            fontFamily: T.font, fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 180ms cubic-bezier(0.2,0,0,1)',
          }}>
             Adaugă în Apple Wallet
          </button>
        </div>

        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          <button onClick={() => showToast('Link de partajare copiat')} className="press" style={{
            flex: 1, padding: '12px', background: '#F4F4F5', color: '#18181B', border: 0,
            borderRadius: 12, cursor: 'pointer',
            fontFamily: T.font, fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><Icon name="share" size={14} /> Distribuie</button>
          <button onClick={() => showToast('Modificare nume — disponibil până la check-in')} className="press" style={{
            flex: 1, padding: '12px', background: '#F4F4F5', color: '#18181B', border: 0,
            borderRadius: 12, cursor: 'pointer',
            fontFamily: T.font, fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><Icon name="user" size={14} /> Editează nume</button>
        </div>

        <div style={{
          padding: '12px 24px 32px',
          fontFamily: T.fontInter, fontSize: 11, color: '#A1A1AA', textAlign: 'center', lineHeight: 1.5,
        }}>
          {t.organizer} · CUI {t.cui} · Biletul este valabil doar pe 2nite.ro și în aplicația 2nite.
        </div>
      </div>
    </div>
  );
}
