import { ASSETS } from './assets';

export const EVENTS = [
  {
    id: 'lala',
    title: 'LaLa Party București',
    artist: 'Azteca · Mihnea Negut',
    image: ASSETS.lalaParty,
    date: 'vin., 3 octombrie · 21:00',
    dateShort: 'vin., 3 oct.',
    dateBadge: 'AZI',
    city: 'București',
    venue: 'Reper By ESS',
    address: 'Calea Victoriei 168',
    coords: { x: 0.42, y: 0.48 },
    latlng: [44.4448, 26.0921],
    price: 30,
    genre: 'House · Trap',
    description: 'LaLa Party în București încă o dată. Trap, house și ritmuri urbane până dimineața — un line-up cu cei mai tari artiști din scena locală.',
    organizer: '2nite',
    organizerFollowers: '12.353',
    tickets: [
      { name: 'General Acces', sub: 'Asigură intrarea la eveniment', price: 30, qty: 1 },
      { name: 'VIP', sub: 'Acces zona privată + welcome drink', price: 75, qty: 0 },
      { name: 'Early-bird', sub: 'Prețul lansării — limitat', price: 22, qty: 0, badge: { kind: 'limited', label: 'Locuri limitate' } },
    ],
    badges: [{ kind: 'limited', label: 'Locuri limitate' }],
  },
  {
    id: 'matter',
    title: 'MATTER · Closing Night',
    artist: 'Mihnea Negut b2b Azteca · +2',
    image: ASSETS.night2,
    date: 'sâm., 2 august · 22:00',
    dateShort: 'sâm., 2 aug.',
    dateBadge: 'WK',
    city: 'București',
    venue: 'MATTER',
    address: 'Strada Universității 3',
    coords: { x: 0.55, y: 0.55 },
    latlng: [44.4332, 26.1023],
    price: 35,
    genre: 'Techno · House',
    description: 'Ultima noapte din serie. Closing night cu Mihnea & Azteca. Capacitate limitată.',
    organizer: 'MATTER',
    organizerFollowers: '8.214',
    tickets: [
      { name: 'General Acces', sub: 'Acces standard', price: 35, qty: 1 },
      { name: 'Early-bird', sub: 'Lansare', price: 25, qty: 0, badge: { kind: 'sold', label: 'Sold out' } },
    ],
    badges: [],
  },
  {
    id: 'beach',
    title: 'Beach, Please Festival',
    artist: '+12 artiști · 3 scene',
    image: ASSETS.search,
    date: 'vin., 28 martie · 22:00',
    dateShort: 'vin., 28 mar.',
    dateBadge: '28.03',
    city: 'Costinești',
    venue: 'Plaja Modern',
    address: 'Faleza Modern',
    coords: { x: 0.78, y: 0.72 },
    latlng: [44.4486, 26.1571],
    price: 120,
    genre: 'Festival · Hip-Hop',
    description: 'Cel mai mare festival de pe litoral revine. Două nopți, trei scene, peste 12 artiști români și internaționali.',
    organizer: 'Beach Please',
    organizerFollowers: '54.001',
    tickets: [
      { name: 'General Acces', sub: 'Acces ambele nopți', price: 120, qty: 1 },
      { name: 'VIP', sub: 'Skip the line + zona VIP', price: 280, qty: 0 },
    ],
    badges: [{ kind: 'pop', label: 'Trending' }],
  },
];

function buildSideEvent(o) {
  const baseNum = parseInt(String(o.price).replace(/\D/g, ''), 10) || 30;
  return {
    artist: o.artist || `Rezidenți ${o.venue}`,
    description: o.description || `${o.title} — o noapte ${o.genre.toLowerCase()} la ${o.venue}, ${o.city}. Doors la 22:00, line-up dezvăluit pe parcurs.`,
    organizer: o.organizer || '2nite',
    organizerFollowers: o.organizerFollowers || '12.353',
    tickets: o.tickets || [
      { name: 'General Acces', sub: 'Asigură intrarea la eveniment', price: baseNum, qty: 1 },
      { name: 'VIP', sub: 'Acces zona privată + welcome drink', price: Math.round(baseNum * 2.2), qty: 0 },
      { name: 'Early-bird', sub: 'Prețul lansării — limitat', price: Math.max(15, Math.round(baseNum * 0.75)), qty: 0, badge: { kind: 'limited', label: 'Locuri limitate' } },
    ],
    badges: o.badges || [],
    ...o,
    price: baseNum,
    priceLabel: o.price,
  };
}

export const SIDE_EVENTS = [
  buildSideEvent({ id: 'fl1', title: 'Floor 9 — DnB Night', date: 'sâm., 8 nov.', dateShort: 'sâm., 8 nov.', city: 'București', venue: 'Form Space', address: 'Str. Stelea Spătarul 13', coords: { x: 0.30, y: 0.62 }, latlng: [44.4279, 26.1024], price: 'de la 25', image: ASSETS.night3, genre: 'Drum & Bass' }),
  buildSideEvent({ id: 'fl2', title: 'Subreal · Vinyl Set', date: 'vin., 14 nov.', dateShort: 'vin., 14 nov.', city: 'Cluj-Napoca', venue: 'Form', address: 'Str. Republicii 4', coords: { x: 0.18, y: 0.22 }, latlng: [46.7712, 23.6236], price: 'de la 40', image: ASSETS.card1, genre: 'House' }),
  buildSideEvent({ id: 'fl3', title: 'Manele Forever', date: 'sâm., 15 nov.', dateShort: 'sâm., 15 nov.', city: 'București', venue: 'Bordello', address: 'Calea Victoriei 2', coords: { x: 0.48, y: 0.42 }, latlng: [44.4361, 26.0978], price: 'de la 60', image: ASSETS.square1, genre: 'Manele' }),
  buildSideEvent({ id: 'fl4', title: 'Live · Robin and the Backstabbers', date: 'joi, 20 nov.', dateShort: 'joi, 20 nov.', city: 'București', venue: 'Control', address: 'Str. Constantin Mille 4', coords: { x: 0.62, y: 0.38 }, latlng: [44.4393, 26.1027], price: 'de la 70', image: ASSETS.card2, genre: 'Live · Rock' }),
  buildSideEvent({ id: 'fl5', title: 'Expirat · Open Air', date: 'vin., 24 oct.', dateShort: 'vin., 24 oct.', city: 'București', venue: 'Expirat Halele Carol', address: 'Str. Mihail Kogălniceanu 5', latlng: [44.4250, 26.0890], price: 'de la 45', image: ASSETS.night2, genre: 'Indie · Live' }),
  buildSideEvent({ id: 'fl6', title: 'Eden · Rooftop Sundown', date: 'dum., 5 oct.', dateShort: 'dum., 5 oct.', city: 'București', venue: 'Eden Garden', address: 'Splaiul Independenței 290', latlng: [44.4318, 26.0506], price: 'de la 35', image: ASSETS.card1, genre: 'House' }),
  buildSideEvent({ id: 'fl7', title: 'Apollo 111 · Cinema Night', date: 'mier., 22 oct.', dateShort: 'mier., 22 oct.', city: 'București', venue: 'Apollo 111', address: 'Strada Eforie 4', latlng: [44.4350, 26.0978], price: 'de la 20', image: ASSETS.portrait1, genre: 'Cinema' }),
];

export const GENRES = [
  { id: 'house', label: 'House', count: 42 },
  { id: 'techno', label: 'Techno', count: 28 },
  { id: 'hiphop', label: 'Hip-Hop', count: 19 },
  { id: 'manele', label: 'Manele', count: 24 },
  { id: 'live', label: 'Live', count: 31 },
  { id: 'rnb', label: 'R&B', count: 8 },
  { id: 'dnb', label: 'D&B', count: 6 },
  { id: 'festival', label: 'Festival', count: 4 },
];
