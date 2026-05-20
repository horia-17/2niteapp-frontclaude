import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Chip } from '../components/Primitives';
import { EVENTS, SIDE_EVENTS } from '../data';
import { useApp } from '../state';

const GENRES = ['Toate', 'House', 'Techno', 'Hip-Hop', 'Manele', 'Live', 'Festival'];

const BUCHAREST_CENTER = [44.4358, 26.1027];

function MapEventCard({ event, onClick, isSaved, onToggleSave }) {
  return (
    <div onClick={onClick} className="press" style={{
      background: T.bg2, border: `1px solid ${T.border}`,
      borderRadius: 18,
      padding: 10, gap: 12,
      display: 'flex', cursor: 'pointer',
      boxShadow: '0 18px 48px rgba(0,0,0,0.55)',
      flexShrink: 0,
      width: 296,
    }}>
      <div style={{
        width: 92, height: 92, borderRadius: 12, flexShrink: 0,
        background: `url(${event.image}) center/cover, ${T.bg3}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 6, left: 6,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          padding: '3px 7px', borderRadius: 6,
          fontFamily: T.font, fontWeight: 700, fontSize: 9, color: '#fff',
          letterSpacing: '-0.01em',
        }}>{event.dateShort || event.date}</div>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 4 }}>
        {event.genre && (
          <div style={{
            fontFamily: T.fontInter, fontWeight: 700, fontSize: 9, color: T.brandGlow,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{event.genre}</div>
        )}
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '-0.01em',
          lineHeight: 1.2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{event.title}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: T.fontInter, fontSize: 11, color: T.fg3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <Icon name="mapPin" size={10} color={T.fg4} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</span>
        </div>
        <div style={{
          marginTop: 'auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: '#fff' }}>
            {typeof event.price === 'number' ? `${event.price} RON` : event.price}
          </span>
          <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} style={{
            background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
            color: isSaved ? T.brandGlow : T.fg3,
            display: 'flex', alignItems: 'center',
          }}>
            <Icon name={isSaved ? 'heartFilled' : 'heart'} size={16} color={isSaved ? T.brandGlow : T.fg3} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MapScreen({ onBack, onOpenEvent }) {
  const { saved, toggleSaved, filters, showToast } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [genre, setGenre] = useState('Toate');
  const [showList, setShowList] = useState(false);
  const [query, setQuery] = useState('');

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const scrollerRef = useRef(null);
  const cardRefs = useRef({});
  const scrollSyncRef = useRef(false); // true while we're programmatically scrolling carousel
  const touchStartRef = useRef(null);

  const cityName = useMemo(() => {
    const map = { bucuresti: 'București', cluj: 'Cluj-Napoca', iasi: 'Iași', timisoara: 'Timișoara', constanta: 'Constanța' };
    return map[filters.city] || 'București';
  }, [filters.city]);

  const allEvents = useMemo(() => [...EVENTS, ...SIDE_EVENTS].filter(e => e.latlng), []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => allEvents.filter(e => {
    const cityMatch = filters.city === 'bucuresti'
      ? e.city === 'București'
      : (e.city || '').toLowerCase().includes(cityName.toLowerCase().split('-')[0]);
    const genreMatch = genre === 'Toate' || (e.genre || '').toLowerCase().includes(genre.toLowerCase());
    const queryMatch = !q || (
      (e.title || '').toLowerCase().includes(q) ||
      (e.venue || '').toLowerCase().includes(q) ||
      (e.address || '').toLowerCase().includes(q) ||
      (e.artist || '').toLowerCase().includes(q) ||
      (e.genre || '').toLowerCase().includes(q)
    );
    return cityMatch && genreMatch && queryMatch;
  }), [allEvents, filters.city, cityName, genre, q]);

  const visible = filtered.length > 0
    ? filtered
    : (q ? [] : allEvents.filter(e => e.city === 'București'));

  // --- Initialize Leaflet map once on mount ---
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: BUCHAREST_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // --- Re-build pins whenever visible list changes ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // remove existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (visible.length === 0) return;

    visible.forEach(e => {
      const icon = L.divIcon({
        className: `twonite-pin ${activeId === e.id ? 'active' : ''}`,
        html: `<div class="pin-wrap" style="--pin-img:url('${e.image}')">
                 <div class="pin-bubble"></div>
                 <div class="pin-tail"></div>
               </div>`,
        iconSize: [40, 52],
        iconAnchor: [20, 52],
      });
      const marker = L.marker(e.latlng, { icon }).addTo(map);
      marker.on('click', () => focusEvent(e.id, true));
      markersRef.current[e.id] = marker;
    });

    // fit bounds to visible markers
    const group = L.featureGroup(Object.values(markersRef.current));
    if (group.getBounds().isValid()) {
      map.fitBounds(group.getBounds(), { padding: [80, 80], maxZoom: 14 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.map(e => e.id).join(',')]);

  // --- Update active pin appearance ---
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      if (id === activeId) el.classList.add('active');
      else el.classList.remove('active');
    });
  }, [activeId]);

  const focusEvent = (id, panMap = true) => {
    setActiveId(id);
    const ev = visible.find(e => e.id === id);
    if (!ev) return;
    if (panMap && mapRef.current) {
      mapRef.current.panTo(ev.latlng, { animate: true, duration: 0.45 });
    }
    const card = cardRefs.current[id];
    if (card && scrollerRef.current) {
      scrollSyncRef.current = true;
      const scroller = scrollerRef.current;
      scroller.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
      setTimeout(() => { scrollSyncRef.current = false; }, 600);
    }
  };

  // --- Sync active card on horizontal scroll ---
  const handleCarouselScroll = () => {
    if (scrollSyncRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let closest = null;
    let closestDist = Infinity;
    visible.forEach(e => {
      const card = cardRefs.current[e.id];
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < closestDist) { closestDist = dist; closest = e.id; }
    });
    if (closest && closest !== activeId) {
      setActiveId(closest);
      const ev = visible.find(x => x.id === closest);
      if (ev && mapRef.current) {
        mapRef.current.panTo(ev.latlng, { animate: true, duration: 0.4 });
      }
    }
  };

  const current = visible.find(e => e.id === activeId);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      {/* The real map */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '52px 16px 12px',
        background: 'linear-gradient(to bottom, rgba(15,14,24,0.85) 0%, rgba(15,14,24,0) 100%)',
        display: 'flex', flexDirection: 'column', gap: 12,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          <button onClick={onBack} className="press" style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'rgba(24,24,27,0.92)', backdropFilter: 'blur(20px)',
            border: `1px solid ${T.border}`,
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}><Icon name="chevronLeft" size={18} /></button>

          <div style={{
            flex: 1, minWidth: 0,
            background: 'rgba(24,24,27,0.92)', backdropFilter: 'blur(20px)',
            border: `1px solid ${T.border}`,
            borderRadius: 999, padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="search" size={16} color={T.fg3} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${cityName} · ${visible.length} ${visible.length === 1 ? 'eveniment' : 'evenimente'}`}
              style={{
                flex: 1, minWidth: 0,
                background: 'transparent', border: 0, outline: 'none',
                color: '#fff',
                fontFamily: T.fontInter, fontSize: 13,
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: T.bg3, border: 0, borderRadius: 999,
                width: 20, height: 20, color: T.fg3, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><Icon name="x" size={11} /></button>
            )}
          </div>

          <button onClick={() => setShowList(!showList)} className="press" style={{
            width: 40, height: 40, borderRadius: 999,
            background: showList ? T.brand : 'rgba(24,24,27,0.92)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${showList ? T.brand : T.border}`,
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}><Icon name="list" size={16} /></button>
        </div>

        <div style={{
          display: 'flex', gap: 6, overflow: 'auto', scrollbarWidth: 'none',
          pointerEvents: 'auto',
        }}>
          {GENRES.map(g => (
            <Chip key={g} active={genre === g} onClick={() => { setGenre(g); setActiveId(null); }}>{g}</Chip>
          ))}
        </div>
      </div>

      {/* Right side controls */}
      <div style={{
        position: 'absolute', right: 12, top: '40%', zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <button onClick={() => mapRef.current?.zoomIn()} className="press" style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(24,24,27,0.92)', backdropFilter: 'blur(20px)',
          border: `1px solid ${T.border}`, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="plus" size={16} /></button>
        <button onClick={() => mapRef.current?.zoomOut()} className="press" style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(24,24,27,0.92)', backdropFilter: 'blur(20px)',
          border: `1px solid ${T.border}`, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="minus" size={16} /></button>
        <button onClick={() => { mapRef.current?.setView(BUCHAREST_CENTER, 13, { animate: true }); showToast('Centrat pe București'); }} className="press" style={{
          width: 38, height: 38, borderRadius: 12,
          background: T.brand,
          border: '0', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 22px rgba(91,30,220,0.45)',
        }}><Icon name="navigation" size={16} /></button>
      </div>

      {/* List sheet */}
      {showList && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1100,
          background: T.bg1, borderTop: `1px solid ${T.border}`,
          borderRadius: '24px 24px 0 0',
          maxHeight: '60%', overflow: 'auto',
          padding: '14px 16px 28px',
          animation: 'sheetIn 280ms cubic-bezier(0.2,0,0,1)',
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: T.bg4, margin: '0 auto 14px' }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
          }}>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
              {visible.length} {visible.length === 1 ? 'eveniment' : 'evenimente'}
            </div>
            <button onClick={() => setShowList(false)} style={{
              background: 'transparent', border: 0, color: T.brandGlow,
              fontFamily: T.font, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}><Icon name="map" size={14} /> Hartă</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map(e => (
              <div key={e.id} onClick={() => onOpenEvent(e)} className="press" style={{
                display: 'flex', gap: 12, padding: 10,
                background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14,
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 64, height: 76, borderRadius: 10, flexShrink: 0,
                  background: `url(${e.image}) center/cover, ${T.bg3}`,
                }} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                  <div style={{ fontFamily: T.fontInter, fontWeight: 700, fontSize: 9, color: T.brandGlow, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {e.genre}
                  </div>
                  <div style={{
                    fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{e.title}</div>
                  <div style={{
                    fontFamily: T.fontInter, fontSize: 11, color: T.fg3,
                    display: 'flex', alignItems: 'center', gap: 4,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    <Icon name="mapPin" size={10} color={T.fg4} />
                    {e.venue} · {e.dateShort}
                  </div>
                  <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 12, color: '#fff', marginTop: 2 }}>
                    {typeof e.price === 'number' ? `${e.price} RON` : e.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom: empty state when no results */}
      {!showList && visible.length === 0 && (
        <div style={{
          position: 'absolute', bottom: 28, left: 16, right: 16, zIndex: 1000,
          background: 'rgba(24,24,27,0.94)', backdropFilter: 'blur(14px)',
          border: `1px solid ${T.border}`, borderRadius: 16,
          padding: 16, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <Icon name="search" size={20} color={T.fg3} />
          <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>Niciun rezultat</div>
          <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>
            Schimbă căutarea sau categoria.
          </div>
        </div>
      )}

      {/* Bottom carousel */}
      {!showList && visible.length > 0 && (
        <div
          style={{
            position: 'absolute', bottom: 16, left: 0, right: 0, zIndex: 1000,
            paddingTop: 14,
          }}
          onTouchStart={(e) => { touchStartRef.current = e.touches[0].clientY; }}
          onTouchMove={(e) => {
            if (touchStartRef.current == null) return;
            const dy = touchStartRef.current - e.touches[0].clientY;
            if (dy > 60) {
              setShowList(true);
              touchStartRef.current = null;
            }
          }}
          onTouchEnd={() => { touchStartRef.current = null; }}
        >
          <button
            onClick={() => setShowList(true)}
            aria-label="Deschide lista de evenimente"
            style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(24,24,27,0.85)', backdropFilter: 'blur(14px)',
              border: `1px solid ${T.border}`,
              borderRadius: 999, padding: '4px 12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              color: T.fg2, fontFamily: T.fontInter, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            <div style={{ width: 28, height: 3, borderRadius: 999, background: T.fg4 }} />
            Trage în sus pentru listă
          </button>
          <div
            ref={scrollerRef}
            onScroll={handleCarouselScroll}
            style={{
              display: 'flex', gap: 12, overflow: 'auto', scrollbarWidth: 'none',
              padding: '0 16px 4px',
              scrollSnapType: 'x mandatory',
            }}
          >
            {visible.map(e => (
              <div key={e.id}
                ref={(el) => (cardRefs.current[e.id] = el)}
                style={{ scrollSnapAlign: 'start' }}
              >
                <MapEventCard
                  event={e}
                  isSaved={saved.has(e.id)}
                  onToggleSave={() => toggleSaved(e.id)}
                  onClick={() => onOpenEvent(e)}
                />
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8,
          }}>
            {visible.map(e => (
              <div key={e.id} style={{
                width: current?.id === e.id ? 18 : 6,
                height: 6, borderRadius: 999,
                background: current?.id === e.id ? T.brand : 'rgba(255,255,255,0.25)',
                transition: 'all 200ms',
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
