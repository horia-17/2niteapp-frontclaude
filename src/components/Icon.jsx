const ICONS = {
  search: 'M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  ticket: 'M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3Z M13 5v2 M13 17v2 M13 11v2',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  mapPin: 'M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z',
  heartFilled: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  qr: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3v3 M14 20h3 M20 14v3 M17 17v3 M20 20h1',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  chevronLeft: 'M15 18l-6-6 6-6',
  plus: 'M12 5v14 M5 12h14',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  eyeOff: 'M9.88 9.88a3 3 0 1 0 4.24 4.24 M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68 M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61 M2 2l20 20',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z',
  check: 'M20 6L9 17l-5-5',
  star: 'M11.5 1.5l3 6.5 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6.5Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2',
  x: 'M18 6L6 18 M6 6l12 12',
  more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
  minus: 'M5 12h14',
  map: 'M1 6v15l7-3 8 3 7-3V3l-7 3-8-3-7 3Z M8 3v15 M16 6v15',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M2 12h20 M12 2a14 14 0 0 1 0 20 M12 2a14 14 0 0 0 0 20',
  building: 'M3 21h18 M5 21V7l7-4 7 4v14 M9 9h.01 M13 9h.01 M9 13h.01 M13 13h.01 M9 17h.01 M13 17h.01',
  card: 'M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z M2 10h20 M6 15h3',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  navigation: 'M3 11l19-9-9 19-2-8-8-2Z',
  instagram: 'M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Z M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z M17.5 6.5h.01',
  tiktok: 'M16 8a5 5 0 0 0 5 5V8.5A4.5 4.5 0 0 1 16.5 4H13v12.5a2.5 2.5 0 1 1-2.5-2.5',
};

export function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.75 }) {
  const d = ICONS[name];
  if (!d) return null;
  const filled = name.endsWith('Filled');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      {d.split('M').filter(Boolean).map((p, i) => (
        <path key={i} d={'M' + p.trim()} />
      ))}
    </svg>
  );
}
