import { useMemo, useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { BottomNav, SectionLabel } from '../components/EventComponents';
import { Chip, Button } from '../components/Primitives';
import { useApp } from '../state';

function MiniQR({ seed = '' }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const rnd = (x) => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff > x; };
  const cells = [];
  for (let y = 0; y < 13; y++) for (let x = 0; x < 13; x++) {
    if ((x < 3 && y < 3) || (x > 9 && y < 3) || (x < 3 && y > 9)) continue;
    if (rnd(0.55)) cells.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" />);
  }
  return (
    <div style={{ width: 64, height: 64, background: '#fff', borderRadius: 8, padding: 5, flexShrink: 0 }}>
      <svg viewBox="0 0 13 13" shapeRendering="crispEdges" style={{ width: '100%', height: '100%' }}>
        <g fill="#18181B">
          <rect x="0" y="0" width="3" height="3" /><rect x="1" y="1" width="1" height="1" fill="#fff" />
          <rect x="10" y="0" width="3" height="3" /><rect x="11" y="1" width="1" height="1" fill="#fff" />
          <rect x="0" y="10" width="3" height="3" /><rect x="1" y="11" width="1" height="1" fill="#fff" />
          {cells}
        </g>
      </svg>
    </div>
  );
}

function HoloTicket({ ticket, tone = 0, past, onClick }) {
  const tones = [
    'conic-gradient(from 200deg at 70% 30%, #FF6FD8 0deg, #FFB86B 60deg, #FFE76B 120deg, #A77BFF 220deg, #5B1EDC 320deg, #FF6FD8 360deg)',
    'conic-gradient(from 200deg at 30% 50%, #5B1EDC 0deg, #FF6FD8 90deg, #FFB86B 180deg, #A77BFF 270deg, #5B1EDC 360deg)',
    'conic-gradient(from 200deg at 50% 60%, #FFE76B 0deg, #A77BFF 90deg, #FF6FD8 180deg, #5B1EDC 270deg, #FFE76B 360deg)',
  ];
  return (
    <div onClick={onClick} className="press" style={{
      position: 'relative', borderRadius: 22, overflow: 'hidden',
      border: `1px solid ${T.border}`,
      background: T.bg2,
      cursor: 'pointer',
      opacity: past ? 0.55 : 1,
      isolation: 'isolate',
      transform: 'translateZ(0)',
      WebkitMaskImage: '-webkit-radial-gradient(white, black)',
    }}>
      <div style={{
        position: 'absolute', inset: -20,
        background: tones[tone],
        filter: 'blur(40px) saturate(1.1)',
        opacity: 0.85,
      }} />
      <div style={{
        position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.18,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
      }} />
      <div style={{ position: 'relative', padding: 18, display: 'flex', flexDirection: 'column', gap: 0, minHeight: 200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 10,
              padding: '4px 8px', borderRadius: 999,
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)',
              color: '#fff', alignSelf: 'flex-start', letterSpacing: '-0.01em',
            }}>{ticket.type}</span>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.1, maxWidth: 220 }}>{ticket.title}</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 12, color: '#fff', opacity: 0.9 }}>{ticket.date}</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 12, color: '#fff', opacity: 0.75 }}>{ticket.venue}</div>
          </div>
          <MiniQR seed={ticket.qrSeed} />
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: T.fontInter, fontSize: 10, color: '#fff', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Holder</div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>{ticket.holder}</div>
          </div>
          {!past && <Icon name="chevronRight" size={20} color="#fff" />}
          {past && <span style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 11,
            padding: '4px 9px', borderRadius: 999,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
          }}>Folosit</span>}
        </div>
      </div>
    </div>
  );
}

export function TicketsScreen({ onTab, onOpenTicket, onDiscover }) {
  const { tickets } = useApp();
  const [filter, setFilter] = useState('active');

  const active = useMemo(() => tickets.filter(t => t.status === 'active'), [tickets]);
  const past = useMemo(() => tickets.filter(t => t.status !== 'active'), [tickets]);

  const visible = filter === 'active' ? active : filter === 'past' ? past : tickets;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 120 }}>
        <div style={{ padding: '64px 20px 16px' }}>
          <h1 style={{ margin: 0, fontFamily: T.font, fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: '#fff' }}>Biletele mele</h1>
          <div style={{ fontFamily: T.fontInter, fontSize: 14, color: T.fg3, marginTop: 4 }}>
            {active.length} {active.length === 1 ? 'activ' : 'active'} · {past.length} {past.length === 1 ? 'trecut' : 'trecute'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '0 16px 8px' }}>
          <Chip active={filter === 'active'} onClick={() => setFilter('active')}>Următoarele</Chip>
          <Chip active={filter === 'past'} onClick={() => setFilter('past')}>Trecute</Chip>
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Toate</Chip>
        </div>

        {visible.length > 0 ? (
          <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filter !== 'past' && active.length > 0 && (filter === 'all' || filter === 'active') && (
              <>
                <SectionLabel>Următoarele</SectionLabel>
                {active.map((t, i) => (
                  <HoloTicket key={t.id} ticket={t} tone={i % 3} onClick={() => onOpenTicket(t)} />
                ))}
              </>
            )}
            {filter !== 'active' && past.length > 0 && (filter === 'all' || filter === 'past') && (
              <>
                <div style={{ marginTop: 12 }}>
                  <SectionLabel>Evenimente trecute</SectionLabel>
                </div>
                {past.map((t, i) => (
                  <HoloTicket key={t.id} ticket={t} tone={(i + 2) % 3} past onClick={() => onOpenTicket(t)} />
                ))}
              </>
            )}
          </div>
        ) : (
          <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 999,
              background: T.bg2, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.fg3,
            }}><Icon name="ticket" size={26} /></div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 17, color: '#fff' }}>
              {filter === 'past' ? 'Niciun eveniment trecut' : 'Niciun bilet activ'}
            </div>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, maxWidth: 260 }}>
              Cumpără un bilet din ecranul Descoperă și îl găsești aici instant, gata de scanare la intrare.
            </div>
            <Button onClick={onDiscover} size="sm" variant="soft" icon="compass">Descoperă evenimente</Button>
          </div>
        )}
      </div>

      <BottomNav active="tickets" onChange={onTab} />
    </div>
  );
}
