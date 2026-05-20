import { useMemo, useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Chip, Button } from '../components/Primitives';
import { BottomNav, SectionHeader } from '../components/EventComponents';
import { EVENTS, SIDE_EVENTS } from '../data';
import { EventListRow } from './HomeScreen';
import { useApp } from '../state';

function CalendarSlotRow({ event, time, onClick }) {
  return (
    <div onClick={onClick} className="press" style={{
      display: 'flex', alignItems: 'stretch', gap: 14,
      cursor: 'pointer',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44,
      }}>
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 13,
          color: '#fff', letterSpacing: '-0.01em',
        }}>{time}</div>
        <div style={{
          width: 8, height: 8, borderRadius: 999,
          background: T.brand, marginTop: 6, marginBottom: 4,
          boxShadow: '0 0 0 3px rgba(91,30,220,0.25)',
        }} />
        <div style={{ width: 1, flex: 1, background: T.border }} />
      </div>

      <div style={{
        flex: 1, background: T.bg2, border: `1px solid ${T.border}`,
        borderRadius: 14, overflow: 'hidden',
        display: 'flex', minHeight: 96,
      }}>
        <div style={{
          width: 96, flexShrink: 0,
          background: `url(${event.image}) center/cover, ${T.bg3}`,
        }} />
        <div style={{ flex: 1, padding: '12px 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          {event.genre && (
            <div style={{
              fontFamily: T.fontInter, fontWeight: 700, fontSize: 9, color: T.brandGlow,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{event.genre}</div>
          )}
          <div style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '-0.01em',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{event.title}</div>
          <div style={{
            fontFamily: T.fontInter, fontSize: 11, color: T.fg3,
            display: 'flex', alignItems: 'center', gap: 4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            <Icon name="mapPin" size={10} color={T.fg4} />
            {event.venue}
          </div>
          <div style={{
            marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 12, color: '#fff',
            }}>{typeof event.price === 'number' ? `${event.price} RON` : event.price}</span>
            {event.badges?.[0] && (
              <span style={{
                background: 'rgba(245,158,11,0.15)', color: T.warning,
                border: '1px solid rgba(245,158,11,0.3)',
                fontFamily: T.font, fontWeight: 700, fontSize: 10,
                padding: '5px 9px', borderRadius: 999, whiteSpace: 'nowrap',
              }}>{event.badges[0].label}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarScreen({ onTab, onOpenEvent }) {
  const today = 3;
  const months = ['oct', 'nov', 'dec', 'ian', 'feb', 'mar'];
  const days = [
    { dow: 'JOI', dom: 2 },
    { dow: 'VIN', dom: 3, hot: true, count: 8 },
    { dow: 'SÂM', dom: 4, count: 12 },
    { dow: 'DUM', dom: 5, count: 5 },
    { dow: 'LUN', dom: 6 },
    { dow: 'MAR', dom: 7 },
    { dow: 'MIE', dom: 8, count: 3 },
    { dow: 'JOI', dom: 9 },
    { dow: 'VIN', dom: 10, count: 6 },
    { dow: 'SÂM', dom: 11, count: 9 },
    { dow: 'DUM', dom: 12 },
  ];
  const [selectedDom, setSelectedDom] = useState(today);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const dayEvents = selectedDom === today
    ? [EVENTS[0], SIDE_EVENTS[0], SIDE_EVENTS[1]]
    : selectedDom === 4
      ? [EVENTS[1], SIDE_EVENTS[2]]
      : selectedDom === 8
        ? [SIDE_EVENTS[0]]
        : selectedDom === 10
          ? [SIDE_EVENTS[1], SIDE_EVENTS[3]]
          : selectedDom === 11
            ? [EVENTS[2]]
            : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 110 }}>
        <div style={{ padding: '56px 16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h1 style={{ margin: 0, fontFamily: T.font, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: '#fff' }}>Calendar</h1>
            <button onClick={() => { setSelectedMonth(0); setSelectedDom(today); }} style={{
              background: 'transparent', border: 0, padding: 0,
              fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.brandGlow,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>Astăzi <Icon name="arrowRight" size={12} /></button>
          </div>
          <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, marginTop: 4 }}>București · octombrie 2025</div>
        </div>

        <div style={{
          display: 'flex', gap: 8, overflow: 'auto',
          padding: '8px 16px 4px', scrollbarWidth: 'none',
        }}>
          {months.map((m, i) => (
            <Chip key={m} active={i === selectedMonth} onClick={() => setSelectedMonth(i)}>{m}.</Chip>
          ))}
        </div>

        <div style={{
          display: 'flex', gap: 8, overflow: 'auto',
          padding: '14px 16px 4px', scrollbarWidth: 'none',
        }}>
          {days.map(d => {
            const active = d.dom === selectedDom;
            return (
              <button key={d.dom} onClick={() => setSelectedDom(d.dom)} style={{
                width: 52, height: 70, flexShrink: 0,
                borderRadius: 14,
                background: active ? T.brand : T.bg2,
                border: `1px solid ${active ? T.brand : T.border}`,
                color: '#fff', cursor: 'pointer', padding: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: T.fontInter, fontWeight: 700, fontSize: 10,
                  letterSpacing: '0.06em',
                  color: active ? 'rgba(255,255,255,0.85)' : T.fg4,
                }}>{d.dow}</div>
                <div style={{
                  fontFamily: T.font, fontWeight: 800, fontSize: 22, lineHeight: 1, color: '#fff',
                }}>{d.dom}</div>
                {d.count !== undefined && (
                  <div style={{
                    position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: T.fontInter, fontSize: 9, fontWeight: 600,
                    color: active ? '#fff' : (d.hot ? T.brandGlow : T.fg3),
                  }}>{d.count} ev.</div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '20px 16px 8px' }}>
          <SectionHeader
            title={selectedDom === today ? 'Vineri, 3 octombrie' : `${months[selectedMonth]}. ${selectedDom}`}
            sub={`${dayEvents.length} ${dayEvents.length === 1 ? 'eveniment' : 'evenimente'} · București`}
          />
        </div>

        {dayEvents.length > 0 ? (
          <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dayEvents.map((e, i) => (
              <CalendarSlotRow key={e.id} event={e} time={['21:00', '22:30', '23:00'][i] || '20:00'} onClick={() => onOpenEvent(e)} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '4px 16px' }}>
            <div style={{
              background: T.bg2, border: `1px dashed ${T.border}`, borderRadius: 14,
              padding: 20, textAlign: 'center',
            }}>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>Liniște în această zi</div>
              <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3, marginTop: 6 }}>
                Niciun eveniment nu este programat. Verifică alte zile din calendar.
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '24px 16px 8px' }}>
          <SectionHeader title="În următoarele 7 zile" />
        </div>
        <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[EVENTS[1], SIDE_EVENTS[2], EVENTS[2]].map(e => (
            <EventListRow key={e.id} event={e} onClick={() => onOpenEvent(e)} />
          ))}
        </div>
      </div>

      <BottomNav active="calendar" onChange={onTab} />
    </div>
  );
}

function SavedRow({ event, onClick, isSaved, onToggleSave }) {
  return (
    <div onClick={onClick} className="press" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', cursor: 'pointer',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 72, height: 88, borderRadius: 12, flexShrink: 0,
        background: `url(${event.image}) center/cover, ${T.bg3}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 6, left: 6,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          padding: '2px 6px', borderRadius: 6,
          fontFamily: T.font, fontWeight: 700, fontSize: 9, color: '#fff',
        }}>{event.dateShort || event.date}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {event.genre && (
          <div style={{
            fontFamily: T.fontInter, fontWeight: 700, fontSize: 9, color: T.brandGlow,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{event.genre}</div>
        )}
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{event.title}</div>
        <div style={{
          fontFamily: T.fontInter, fontSize: 12, color: T.fg3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{event.venue}{event.city ? ` · ${event.city}` : ''}</div>
        <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: '#fff', marginTop: 2 }}>
          {typeof event.price === 'number' ? `${event.price} RON` : event.price}
        </div>
      </div>
      <button onClick={(ev) => { ev.stopPropagation(); onToggleSave(); }} className="press" style={{
        width: 36, height: 36, borderRadius: 999,
        background: T.bg2, border: `1px solid ${T.border}`,
        color: isSaved ? T.brandGlow : T.fg3, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={isSaved ? 'heartFilled' : 'heart'} size={14} color={isSaved ? T.brandGlow : T.fg3} />
      </button>
    </div>
  );
}

function SortSheet({ value, onPick, onClose }) {
  const options = [
    { id: 'recent', label: 'Recent salvate' },
    { id: 'date', label: 'După data evenimentului' },
    { id: 'price-asc', label: 'Preț: cel mai mic întâi' },
    { id: 'price-desc', label: 'Preț: cel mai mare întâi' },
    { id: 'az', label: 'Alfabetic A — Z' },
  ];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bg1, borderRadius: '24px 24px 0 0',
        border: `1px solid ${T.border}`, borderBottom: 'none',
        padding: '14px 20px 24px',
        animation: 'sheetIn 280ms cubic-bezier(0.2,0,0,1)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: T.bg4, alignSelf: 'center' }} />
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>Sortează</div>
        {options.map(o => {
          const on = value === o.id;
          return (
            <button key={o.id} onClick={() => { onPick(o.id); onClose(); }} className="press" style={{
              padding: '12px 8px', borderRadius: 10, border: 0,
              background: on ? 'rgba(91,30,220,0.15)' : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 999,
                border: `2px solid ${on ? T.brand : T.borderStrong}`,
                background: on ? T.brand : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{on && <Icon name="check" size={11} color="#fff" />}</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: '#fff' }}>{o.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SavedScreen({ onTab, onOpenEvent, onDiscover }) {
  const { saved, toggleSaved } = useApp();
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('recent');
  const [showSort, setShowSort] = useState(false);

  const allEvents = useMemo(() => [...EVENTS, ...SIDE_EVENTS], []);
  const savedEvents = allEvents.filter(e => saved.has(e.id));
  // Treat August / March references as past since today is set to October 2025.
  const isPast = (e) => /\b(aug|mar)\.?/i.test(e.dateShort || e.date || '');

  const filtered = useMemo(() => {
    if (tab === 'upcoming') return savedEvents.filter(e => !isPast(e));
    if (tab === 'past') return savedEvents.filter(isPast);
    return savedEvents;
  }, [savedEvents, tab]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === 'price-asc') list.sort((a, b) => (typeof a.price === 'number' ? a.price : 999) - (typeof b.price === 'number' ? b.price : 999));
    if (sort === 'price-desc') list.sort((a, b) => (typeof b.price === 'number' ? b.price : 0) - (typeof a.price === 'number' ? a.price : 0));
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [filtered, sort]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 110 }}>
        <div style={{ padding: '56px 16px 8px' }}>
          <h1 style={{ margin: 0, fontFamily: T.font, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: '#fff' }}>Salvate</h1>
          <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, marginTop: 4 }}>
            {sorted.length} {sorted.length === 1 ? 'eveniment urmărit' : 'evenimente urmărite'}
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 8, overflow: 'auto',
          padding: '12px 16px 4px', scrollbarWidth: 'none',
        }}>
          <Chip active={tab === 'all'} onClick={() => setTab('all')}>Toate</Chip>
          <Chip active={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Următoare</Chip>
          <Chip active={tab === 'past'} onClick={() => setTab('past')}>Trecute</Chip>
          <Chip icon="filter" onClick={() => setShowSort(true)}>Sortează</Chip>
        </div>

        {sorted.length > 0 ? (
          <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sorted.map(e => (
              <SavedRow
                key={e.id}
                event={e}
                isSaved={saved.has(e.id)}
                onToggleSave={() => toggleSaved(e.id)}
                onClick={() => onOpenEvent(e)}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '32px 16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: T.bg2, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.fg3,
            }}><Icon name="heart" size={24} /></div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: '#fff' }}>Nimic salvat încă</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, maxWidth: 240 }}>
              Apasă inima pe orice eveniment ca să-l păstrezi aici pentru mai târziu.
            </div>
          </div>
        )}

        <div style={{ padding: '24px 16px' }}>
          <div style={{
            background: T.bg2, border: `1px dashed ${T.border}`, borderRadius: 14,
            padding: 20, textAlign: 'center',
          }}>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>Cauți ceva nou?</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3, margin: '6px 0 14px' }}>
              Descoperă evenimente după gen, oraș sau dată.
            </div>
            <Button onClick={onDiscover} variant="soft" size="sm" icon="compass">Deschide Descoperă</Button>
          </div>
        </div>
      </div>

      <BottomNav active="saved" onChange={onTab} />
      {showSort && <SortSheet value={sort} onPick={setSort} onClose={() => setShowSort(false)} />}
    </div>
  );
}
