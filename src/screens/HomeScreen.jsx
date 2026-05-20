import { useMemo, useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Chip } from '../components/Primitives';
import { BottomNav, SectionHeader } from '../components/EventComponents';
import { EVENTS, SIDE_EVENTS, GENRES } from '../data';
import { useApp, unreadCount } from '../state';

const topIconStyle = {
  width: 38, height: 38, borderRadius: 999,
  background: T.bg2, border: `1px solid ${T.border}`,
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0, position: 'relative',
};

function FeaturedEventCard({ event, onClick }) {
  const parts = (event.dateShort || '').split(',')[0]?.replace('.', '').toUpperCase() || '';
  const day = (event.dateShort || '').match(/\d+/)?.[0] || '·';
  return (
    <div onClick={onClick} className="press lift" style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden',
      background: T.bg2, border: `1px solid ${T.border}`,
      cursor: 'pointer', aspectRatio: '4 / 5',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `url(${event.image}) center/cover` }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 70%)',
      }} />
      <div style={{
        position: 'absolute', top: 14, left: 14,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        padding: '6px 12px 8px', borderRadius: 12,
        display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48,
      }}>
        <div style={{ fontFamily: T.fontInter, fontSize: 9, color: T.brandGlow, fontWeight: 700, letterSpacing: '0.06em' }}>{parts}</div>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1 }}>{day}</div>
      </div>
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
        {event.badges?.map((b, i) => (
          <span key={i} style={{
            background: 'rgba(245,158,11,0.15)', color: T.warning,
            border: '1px solid rgba(245,158,11,0.3)',
            fontFamily: T.font, fontWeight: 700, fontSize: 10,
            padding: '5px 9px', borderRadius: 999, whiteSpace: 'nowrap',
          }}>{b.label}</span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontFamily: T.fontInter, fontSize: 11, color: T.brandGlow,
          fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{event.genre}</div>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 24,
          lineHeight: 1.05, color: '#fff', letterSpacing: '-0.02em',
        }}>{event.title}</div>
        <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg2, marginTop: 2 }}>
          {event.artist}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 12,
        }}>
          <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>
            {event.venue} · {event.city}
          </div>
          <span style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 12, color: '#fff',
            background: T.brand, padding: '6px 12px', borderRadius: 999,
          }}>{event.price} RON</span>
        </div>
      </div>
    </div>
  );
}

function PortraitEventCard({ event, onClick }) {
  return (
    <div onClick={onClick} className="press" style={{
      position: 'relative', flexShrink: 0,
      width: 180, height: 240,
      borderRadius: 16, overflow: 'hidden',
      background: T.bg2, border: `1px solid ${T.border}`,
      cursor: 'pointer',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `url(${event.image}) center/cover` }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 80%)',
      }} />
      <div style={{
        position: 'absolute', top: 10, left: 10,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(20px)',
        padding: '3px 8px', borderRadius: 8,
        fontFamily: T.font, fontWeight: 700, fontSize: 10, color: '#fff',
      }}>{event.dateShort || event.date}</div>
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 14,
          color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.15,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{event.title}</div>
        <div style={{
          fontFamily: T.fontInter, fontSize: 11, color: T.fg3, marginTop: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4,
        }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</span>
          <span style={{ color: '#fff', fontFamily: T.font, fontWeight: 700, whiteSpace: 'nowrap' }}>
            {typeof event.price === 'number' ? `${event.price} RON` : event.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EventListRow({ event, onClick }) {
  const priceLabel = typeof event.price === 'number' ? `${event.price}` : event.price;
  return (
    <div onClick={onClick} className="press" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0',
      cursor: 'pointer',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 56, height: 64, borderRadius: 10,
        background: T.bg2, border: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: T.fontInter, fontWeight: 700, fontSize: 9, color: T.brandGlow, letterSpacing: '0.08em' }}>
          {(event.dateShort || '').split(',')[0]?.replace('.', '').toUpperCase()}
        </div>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: '#fff', lineHeight: 1, marginTop: 2 }}>
          {(event.dateShort || '').match(/\d+/)?.[0] || '·'}
        </div>
      </div>

      <div style={{
        width: 64, height: 64, borderRadius: 10, flexShrink: 0,
        background: `url(${event.image}) center/cover, ${T.bg3}`,
      }} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{event.title}</div>
        <div style={{
          fontFamily: T.fontInter, fontSize: 12, color: T.fg3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{event.venue}{event.city ? ` · ${event.city}` : ''}</div>
        {event.genre && (
          <div style={{
            fontFamily: T.fontInter, fontSize: 10, color: T.fg4,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>{event.genre}</div>
        )}
      </div>

      <div style={{
        fontFamily: T.font, fontWeight: 700, fontSize: 13, color: '#fff',
        background: T.bg2, border: `1px solid ${T.border}`,
        padding: '8px 12px', borderRadius: 999, flexShrink: 0,
      }}>{priceLabel} <span style={{ fontSize: 10, color: T.fg4 }}>RON</span></div>
    </div>
  );
}

function EditorPickCard({ event, onClick }) {
  return (
    <div onClick={onClick} className="press lift" style={{
      background: T.bg2, border: `1px solid ${T.border}`,
      borderRadius: 16, overflow: 'hidden',
      cursor: 'pointer',
    }}>
      <div style={{
        height: 180,
        background: `url(${event.image}) center/cover, ${T.bg3}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,0.95)', color: T.bg1,
          padding: '4px 9px', borderRadius: 6,
          fontFamily: T.font, fontWeight: 800, fontSize: 9,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Editor's Pick</div>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontFamily: T.fontInter, fontWeight: 700, fontSize: 10, color: T.brandGlow,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{event.genre}</div>
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.015em',
        }}>{event.title}</div>
        <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>
          {event.date} · {event.venue}, {event.city}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 6,
        }}>
          <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg2 }}>
            de la <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>{event.price} RON</span>
          </div>
          <span style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 12, color: '#fff',
            background: T.brand, padding: '8px 14px', borderRadius: 999,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>Vezi <Icon name="arrowRight" size={12} /></span>
        </div>
      </div>
    </div>
  );
}

const CITIES = [
  { id: 'bucuresti', label: 'București' },
  { id: 'cluj', label: 'Cluj-Napoca' },
  { id: 'iasi', label: 'Iași' },
  { id: 'timisoara', label: 'Timișoara' },
  { id: 'constanta', label: 'Constanța' },
];

const WHEN_OPTIONS = [
  { id: 'disearda', label: 'Diseară' },
  { id: 'maine', label: 'Mâine' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'saptamana', label: 'Săpt. asta' },
  { id: 'luna', label: 'Luna asta' },
];

export function HomeScreen({ onOpenEvent, onOpenFilters, onOpenSearch, onOpenNotifications, onOpenGenre, onOpenCalendar, onOpenMap, onTab, onOpenCityPicker }) {
  const { filters, setFilters, notifications } = useApp();
  const unread = unreadCount(notifications);

  const cityLabel = CITIES.find(c => c.id === filters.city)?.label || 'București';
  const allEvents = useMemo(() => [...EVENTS, ...SIDE_EVENTS], []);

  const cityEvents = allEvents.filter(e => {
    const eCity = (e.city || '').toLowerCase();
    return eCity.includes(cityLabel.toLowerCase().split('-')[0]) || (filters.city === 'bucuresti' && !e.city);
  });

  const featured = cityEvents[0] || EVENTS[0];
  const tonight = (cityEvents.length >= 2 ? cityEvents : EVENTS).slice(0, 2);
  const weekend = (cityEvents.length >= 4 ? cityEvents : [...EVENTS, ...SIDE_EVENTS]).slice(1, 5);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 110 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '56px 16px 12px',
        }}>
          <button onClick={onOpenCityPicker} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 0, color: '#fff', cursor: 'pointer',
            padding: 0,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 999,
              background: T.brand, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.font, fontWeight: 800, fontSize: 11,
              letterSpacing: '-0.02em',
            }}>2n</span>
            <span style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em',
            }}>{cityLabel}</span>
            <Icon name="chevronDown" size={14} color={T.fg3} />
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onOpenSearch} className="press" style={topIconStyle}><Icon name="search" size={18} /></button>
            <button onClick={onOpenMap} className="press" style={topIconStyle}><Icon name="map" size={18} /></button>
            <button onClick={onOpenNotifications} className="press" style={topIconStyle}>
              <Icon name="bell" size={18} />
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: 5, right: 5,
                  width: 9, height: 9, borderRadius: 999,
                  background: T.brand, border: `2px solid ${T.bg2}`, boxSizing: 'content-box',
                }} />
              )}
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 8, overflow: 'auto', padding: '0 16px 4px',
          scrollbarWidth: 'none',
        }}>
          {WHEN_OPTIONS.map(o => (
            <Chip key={o.id} active={filters.when === o.id}
              onClick={() => setFilters({ ...filters, when: o.id })}>{o.label}</Chip>
          ))}
          <Chip icon="filter" onClick={onOpenFilters}>Filtre</Chip>
        </div>

        <div style={{ padding: '20px 16px 8px' }}>
          <SectionHeader title={`Diseară în ${cityLabel}`} count={tonight.length} action="Vezi tot" onAction={onOpenCalendar} />
        </div>

        <div style={{ padding: '8px 16px 0' }}>
          <FeaturedEventCard event={featured} onClick={() => onOpenEvent(featured)} />
        </div>

        <div style={{
          display: 'flex', gap: 12, overflow: 'auto',
          padding: '16px 16px 8px', scrollbarWidth: 'none',
        }}>
          {tonight.slice(1).concat([SIDE_EVENTS[0], SIDE_EVENTS[1]]).slice(0, 4).map(e => (
            <PortraitEventCard key={e.id} event={e} onClick={() => onOpenEvent(e)} />
          ))}
        </div>

        <div style={{ padding: '24px 16px 8px' }}>
          <SectionHeader title="Weekend" sub="vin. 3 — dum. 5 oct" action="Vezi tot" onAction={onOpenCalendar} />
        </div>
        <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {weekend.map((e, i) => (
            <EventListRow key={e.id || i} event={e} onClick={() => onOpenEvent(e)} />
          ))}
        </div>

        <div style={{ padding: '24px 16px 8px' }}>
          <SectionHeader title="Recomandate pentru tine" sub="Bazat pe ce ai văzut" />
        </div>
        <div style={{ padding: '0 16px' }}>
          <EditorPickCard event={EVENTS[2]} onClick={() => onOpenEvent(EVENTS[2])} />
        </div>

        <div style={{ padding: '24px 16px 8px' }}>
          <SectionHeader title="Explorează după gen" />
        </div>
        <div style={{
          padding: '0 16px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
        }}>
          {GENRES.map(g => (
            <button key={g.id} onClick={() => onOpenGenre(g)} className="press" style={{
              background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: '14px 16px', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 4,
              cursor: 'pointer',
            }}>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: '#fff' }}>{g.label}</div>
              <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{g.count} evenimente</div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="discover" onChange={onTab} />
    </div>
  );
}

export function FilterSheet({ onClose, onApply }) {
  const { filters, setFilters } = useApp();
  const [when, setWhen] = useState(filters.when);
  const [city, setCity] = useState(filters.city);
  const [genre, setGenre] = useState(filters.genre);

  const cities = [
    { id: 'bucuresti', label: 'București', sub: '184 evenimente' },
    { id: 'cluj', label: 'Cluj-Napoca', sub: '67 evenimente' },
    { id: 'iasi', label: 'Iași', sub: '24 evenimente' },
    { id: 'timisoara', label: 'Timișoara', sub: '31 evenimente' },
    { id: 'constanta', label: 'Constanța', sub: '12 evenimente' },
  ];

  const cityCount = cities.find(c => c.id === city)?.sub.match(/\d+/)?.[0] || '184';

  const apply = () => {
    setFilters({ when, city, genre });
    onApply();
  };

  const reset = () => {
    setWhen('disearda'); setCity('bucuresti'); setGenre('Toate');
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bg1, borderRadius: '24px 24px 0 0',
        border: `1px solid ${T.border}`, borderBottom: 'none',
        padding: '14px 20px 28px',
        display: 'flex', flexDirection: 'column', gap: 22,
        maxHeight: '85%', overflow: 'auto',
        animation: 'sheetIn 280ms cubic-bezier(0.2,0,0,1)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: T.bg4, alignSelf: 'center' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontFamily: T.font, fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>Filtrează</h2>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 999,
            background: T.bg2, border: `1px solid ${T.border}`,
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="x" size={14} /></button>
        </div>

        <div>
          <SheetHeading>Când?</SheetHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {[
              { id: 'disearda', label: 'Diseară' },
              { id: 'maine', label: 'Mâine' },
              { id: 'weekend', label: 'În weekend' },
              { id: 'saptamana', label: 'Săptămâna asta' },
              { id: 'luna', label: 'Luna asta' },
            ].map(o => (
              <Chip key={o.id} active={when === o.id} onClick={() => setWhen(o.id)}>{o.label}</Chip>
            ))}
          </div>
        </div>

        <div>
          <SheetHeading>Unde?</SheetHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
            {cities.map(c => (
              <button key={c.id} onClick={() => setCity(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 8px', border: 'none', borderRadius: 10,
                background: city === c.id ? 'rgba(91,30,220,0.15)' : 'transparent',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 999,
                  border: `2px solid ${city === c.id ? T.brand : T.borderStrong}`,
                  background: city === c.id ? T.brand : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{city === c.id && <Icon name="check" size={11} color="#fff" />}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: '#fff' }}>{c.label}</div>
                </div>
                <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4 }}>{c.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <SheetHeading>Gen</SheetHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {['Toate', 'House', 'Techno', 'Hip-Hop', 'Manele', 'Live', 'R&B', 'D&B', 'Festival'].map(g => (
              <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{
            fontFamily: T.font, fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em',
            background: 'transparent', color: '#fff',
            border: `1px solid ${T.borderStrong}`,
            height: 50, padding: '0 22px', borderRadius: 999, cursor: 'pointer',
          }}>Resetează</button>
          <button onClick={apply} style={{
            flex: 1,
            fontFamily: T.font, fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em',
            background: T.brand, color: '#fff', border: 0,
            height: 50, borderRadius: 999, cursor: 'pointer',
          }}>
            Aplică · {cityCount} evenimente
          </button>
        </div>
      </div>
    </div>
  );
}

export function CityPickerSheet({ onClose, onPick }) {
  const { filters, setFilters } = useApp();
  const [city, setCity] = useState(filters.city);
  const cities = [
    { id: 'bucuresti', label: 'București', sub: '184 evenimente' },
    { id: 'cluj', label: 'Cluj-Napoca', sub: '67 evenimente' },
    { id: 'iasi', label: 'Iași', sub: '24 evenimente' },
    { id: 'timisoara', label: 'Timișoara', sub: '31 evenimente' },
    { id: 'constanta', label: 'Constanța', sub: '12 evenimente' },
  ];

  const confirm = () => {
    setFilters({ ...filters, city });
    onPick();
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bg1, borderRadius: '24px 24px 0 0',
        border: `1px solid ${T.border}`, borderBottom: 'none',
        padding: '14px 20px 28px',
        display: 'flex', flexDirection: 'column', gap: 14,
        animation: 'sheetIn 280ms cubic-bezier(0.2,0,0,1)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: T.bg4, alignSelf: 'center' }} />
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em',
        }}>Alege orașul</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cities.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 8px', border: 'none', borderRadius: 10,
              background: city === c.id ? 'rgba(91,30,220,0.15)' : 'transparent',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 999,
                border: `2px solid ${city === c.id ? T.brand : T.borderStrong}`,
                background: city === c.id ? T.brand : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{city === c.id && <Icon name="check" size={11} color="#fff" />}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: '#fff' }}>{c.label}</div>
                <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4 }}>{c.sub}</div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={confirm} style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 15,
          background: T.brand, color: '#fff', border: 0,
          height: 50, borderRadius: 999, cursor: 'pointer', width: '100%',
        }}>Confirmă</button>
      </div>
    </div>
  );
}

function SheetHeading({ children }) {
  return <h3 style={{
    margin: 0,
    fontFamily: T.fontInter, fontWeight: 700, fontSize: 11,
    color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase',
  }}>{children}</h3>;
}
