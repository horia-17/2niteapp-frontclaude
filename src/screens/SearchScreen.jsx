import { useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { SectionHeader, SheetHeading } from '../components/EventComponents';
import { EVENTS, SIDE_EVENTS } from '../data';
import { EventListRow } from './HomeScreen';

const DEFAULT_RECENT = ['MATTER', 'Beach Please', 'Reper By ESS', 'Cluj-Napoca'];

export function SearchScreen({ onClose, onOpenEvent, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [recent, setRecent] = useState(DEFAULT_RECENT);

  const trending = ['LaLa Party', 'Closing Night', 'DnB Night', 'Direct din Trap'];

  const allEvents = EVENTS.concat(SIDE_EVENTS);
  const results = query.length === 0
    ? []
    : allEvents.filter(e =>
        (e.title || '').toLowerCase().includes(query.toLowerCase()) ||
        (e.venue || '').toLowerCase().includes(query.toLowerCase()) ||
        (e.city || '').toLowerCase().includes(query.toLowerCase()) ||
        (e.genre || '').toLowerCase().includes(query.toLowerCase()) ||
        (e.artist || '').toLowerCase().includes(query.toLowerCase())
      );

  const open = (e) => {
    if (query.trim() && !recent.includes(query.trim())) {
      setRecent([query.trim(), ...recent.filter(r => r !== query.trim())].slice(0, 6));
    }
    onOpenEvent(e);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: T.bg1, zIndex: 90,
      display: 'flex', flexDirection: 'column',
      animation: 'searchIn 220ms cubic-bezier(0.2,0,0,1)',
    }}>
      <div style={{ padding: '52px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', alignItems: 'center', gap: 10,
          background: T.bg2, border: `1px solid ${T.borderStrong}`,
          borderRadius: 14, padding: '12px 14px',
        }}>
          <Icon name="search" size={18} color={T.fg3} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută evenimente, locații, artiști…"
            style={{
              flex: 1, minWidth: 0,
              background: 'transparent', border: 0, outline: 'none',
              color: '#fff',
              fontFamily: T.fontInter, fontSize: 14,
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: T.bg3, border: 0, borderRadius: 999,
              width: 22, height: 22, color: T.fg3, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}><Icon name="x" size={12} /></button>
          )}
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 0, padding: '6px 0',
          fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.fg2,
          cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
        }}>Anulează</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 32 }}>
        {results.length > 0 ? (
          <div style={{ padding: '8px 16px' }}>
            <SectionHeader title={`${results.length} ${results.length === 1 ? 'rezultat' : 'rezultate'}`} sub={`pentru „${query}"`} />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {results.map(e => (
                <EventListRow key={e.id} event={e} onClick={() => open(e)} />
              ))}
            </div>
          </div>
        ) : query.length > 0 ? (
          <div style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: T.bg2, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.fg3,
            }}><Icon name="search" size={22} /></div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: '#fff' }}>Niciun rezultat</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, maxWidth: 240 }}>
              Încearcă alt cuvânt sau schimbă orașul în filtre.
            </div>
            <button onClick={() => setQuery('')} style={{
              marginTop: 8, padding: '10px 18px', borderRadius: 999,
              background: T.bg2, border: `1px solid ${T.borderStrong}`,
              color: '#fff', cursor: 'pointer',
              fontFamily: T.font, fontWeight: 600, fontSize: 13,
            }}>Șterge căutarea</button>
          </div>
        ) : (
          <>
            {recent.length > 0 && (
              <div style={{ padding: '16px 16px 8px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <SheetHeading>Căutări recente</SheetHeading>
                  <button onClick={() => setRecent([])} style={{
                    background: 'transparent', border: 0, padding: 0,
                    fontFamily: T.fontInter, fontSize: 11, color: T.fg4, cursor: 'pointer',
                  }}>Șterge</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {recent.map(r => (
                    <button key={r} onClick={() => setQuery(r)} style={{
                      background: T.bg2, border: `1px solid ${T.border}`,
                      borderRadius: 999, padding: '8px 12px 8px 10px',
                      fontFamily: T.fontInter, fontWeight: 500, fontSize: 12, color: '#fff',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}>
                      <Icon name="clock" size={12} color={T.fg4} /> {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: '16px 16px 8px' }}>
              <SheetHeading>Trending acum</SheetHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
                {trending.map((t, i) => (
                  <button key={t} onClick={() => setQuery(t)} style={{
                    background: 'transparent', border: 0,
                    padding: '12px 4px',
                    fontFamily: T.font, fontWeight: 500, fontSize: 14, color: '#fff',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: `1px solid ${T.border}`,
                  }}>
                    <span style={{
                      fontFamily: T.font, fontWeight: 800, fontSize: 13,
                      color: T.brandGlow, width: 18, textAlign: 'left',
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{t}</span>
                    <Icon name="arrowRight" size={14} color={T.fg4} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '20px 16px 8px' }}>
              <SheetHeading>Explorează</SheetHeading>
              <div style={{
                marginTop: 10,
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
              }}>
                {['House', 'Techno', 'Hip-Hop', 'Manele', 'Festival', 'Live'].map(g => (
                  <button key={g} onClick={() => setQuery(g)} style={{
                    background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 12,
                    padding: '14px 14px', textAlign: 'left',
                    cursor: 'pointer', color: '#fff',
                    fontFamily: T.font, fontWeight: 600, fontSize: 14,
                  }}>{g}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
