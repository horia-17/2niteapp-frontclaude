import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { EVENTS } from './data';

const AppCtx = createContext(null);

const seedTicket = (e, type, code, serial, qrSeed) => ({
  id: `${e.id}-${type}`,
  eventId: e.id,
  title: e.title,
  date: e.date,
  venue: e.venue,
  address: e.address,
  image: e.image,
  type,
  price: e.tickets.find(t => t.name === type)?.price ?? e.price,
  holder: 'Dumitru Horia-Radu',
  serial,
  code,
  qrSeed,
  organizer: '2NITE MEDIA S.R.L.',
  cui: '48557929',
  status: 'active',
});

const seedPastTicket = (e, type, code, serial, qrSeed) => ({
  ...seedTicket(e, type, code, serial, qrSeed),
  date: 'sâm., 17 august · 22:00',
  venue: 'Plaja Modern',
  address: 'Costinești',
  title: 'Beach, Please Festival \'24',
  status: 'used',
});

export function AppProvider({ children }) {
  const [saved, setSaved] = useState(() => new Set([EVENTS[0].id, 'fl4', EVENTS[2].id, 'fl2']));
  const [follows, setFollows] = useState(() => new Set(['2nite']));
  const [tickets, setTickets] = useState(() => [
    seedTicket(EVENTS[0], 'General Acces', 'FM8HT9WMAVH7', 'NIT2222033002139029', 'lala-1'),
    seedTicket(EVENTS[1], 'Early-bird', 'KQ2R7P3WMAVH7', 'NIT9911033118291029', 'matter-1'),
    seedPastTicket(EVENTS[2], 'VIP', 'XX1198BEACH001', 'NIT77110823BEACH01', 'beach-1'),
  ]);
  const [notifications, setNotifications] = useState(() => ([
    { id: 'n1', kind: 'reminder', title: 'LaLa Party începe în 3 ore', body: 'Reper By ESS · 21:00. Adu-ți biletul în Bilete.', when: 'Azi · 18:00', unread: true, eventId: EVENTS[0].id },
    { id: 'n2', kind: 'drop', title: 'Bilete noi: MATTER · Closing Night', body: 'Early-bird s-a epuizat. General Acces disponibil de la 35 RON.', when: 'Azi · 12:14', unread: true, eventId: EVENTS[1].id },
    { id: 'n3', kind: 'follow', title: '2nite a publicat un eveniment nou', body: 'Beach, Please Festival — pre-sale activ.', when: 'Ieri · 19:02', unread: false, eventId: EVENTS[2].id },
    { id: 'n4', kind: 'system', title: 'Profilul tău este complet', body: 'Bun venit pe 2nite. Activează notificările pentru reminder înainte de eveniment.', when: 'Marți · 09:21', unread: false },
  ]));
  const [filters, setFilters] = useState({ when: 'disearda', city: 'bucuresti', genre: 'Toate' });
  const [cart, setCart] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast({ msg, id: Date.now() });
    setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleSaved = useCallback((id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else { next.add(id); }
      return next;
    });
  }, []);

  const toggleFollow = useCallback((name) => {
    setFollows(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  const startCheckout = useCallback((event, lineItems) => {
    const items = lineItems.filter(li => li.qty > 0);
    if (items.length === 0) return false;
    setCart({ event, items });
    return true;
  }, []);

  const completePurchase = useCallback(() => {
    if (!cart) return [];
    const created = cart.items.flatMap(li => Array.from({ length: li.qty }, (_, i) => {
      const code = (Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6))
        .toUpperCase().slice(0, 12);
      const serial = 'NIT' + Math.floor(Math.random() * 1e16).toString().padStart(16, '0');
      return {
        id: `${cart.event.id}-${li.name}-${Date.now()}-${i}`,
        eventId: cart.event.id,
        title: cart.event.title,
        date: cart.event.date,
        venue: cart.event.venue,
        address: cart.event.address,
        image: cart.event.image,
        type: li.name,
        price: li.price,
        holder: 'Dumitru Horia-Radu',
        serial,
        code,
        qrSeed: `${cart.event.id}-${code}`,
        organizer: '2NITE MEDIA S.R.L.',
        cui: '48557929',
        status: 'active',
      };
    }));
    setTickets(prev => [...created, ...prev]);
    return created;
  }, [cart]);

  const clearCart = useCallback(() => setCart(null), []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const value = useMemo(() => ({
    saved, toggleSaved,
    follows, toggleFollow,
    tickets, setTickets,
    notifications, markAllRead, removeNotification,
    filters, setFilters,
    cart, startCheckout, completePurchase, clearCart,
    toast, showToast,
  }), [saved, follows, tickets, notifications, filters, cart, toast, toggleSaved, toggleFollow, markAllRead, removeNotification, startCheckout, completePurchase, clearCart, showToast]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp must be inside AppProvider');
  return v;
}

export function unreadCount(notifications) {
  return notifications.filter(n => n.unread).length;
}
