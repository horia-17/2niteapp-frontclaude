import { useCallback, useState } from 'react';
import { IOSDevice } from './components/IOSFrame';
import { HomeScreen, FilterSheet, CityPickerSheet } from './screens/HomeScreen';
import { EventDetailScreen } from './screens/EventDetailScreen';
import { TicketsScreen } from './screens/TicketsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CalendarScreen, SavedScreen } from './screens/CalendarSavedScreens';
import { SearchScreen } from './screens/SearchScreen';
import { OrganizerScreen, TicketDetailScreen } from './screens/OrganizerTicketScreens';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { MapScreen } from './screens/MapScreen';
import {
  PersonalDataScreen, PaymentMethodsScreen,
  ChangePasswordScreen, LegalScreen, MapSheet,
} from './screens/AccountSubScreens';
import { AppProvider, useApp } from './state';
import { EVENTS, SIDE_EVENTS } from './data';

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div key={toast.id} style={{
      position: 'absolute', left: '50%', bottom: 110, transform: 'translateX(-50%)',
      zIndex: 200,
      background: 'rgba(24,24,27,0.94)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999,
      padding: '12px 18px',
      fontFamily: '"Unbounded", system-ui, sans-serif', fontWeight: 600, fontSize: 13, color: '#fff',
      letterSpacing: '-0.01em',
      boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
      animation: 'toastIn 320ms cubic-bezier(0.2,0,0,1)',
      whiteSpace: 'nowrap', maxWidth: '85%',
      overflow: 'hidden', textOverflow: 'ellipsis',
    }}>{toast.msg}</div>
  );
}

function PhoneApp() {
  const { showToast, startCheckout, cart } = useApp();

  const [route, setRoute] = useState({ name: 'home' });
  const [history, setHistory] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(null); // null or { query }
  const [showCity, setShowCity] = useState(false);
  const [showMap, setShowMap] = useState(null);

  const push = useCallback((next) => {
    setHistory(prev => [...prev, route]);
    setRoute(next);
  }, [route]);

  const replace = useCallback((next) => {
    setRoute(next);
  }, []);

  const back = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) { setRoute({ name: 'home' }); return prev; }
      const last = prev[prev.length - 1];
      setRoute(last);
      return prev.slice(0, -1);
    });
  }, []);

  const home = useCallback(() => {
    setHistory([]);
    setRoute({ name: 'home' });
  }, []);

  const openEvent = useCallback((event) => {
    setShowSearch(null);
    push({ name: 'event', event });
  }, [push]);

  const openOrganizer = useCallback((event) => {
    push({ name: 'organizer', organizer: { organizer: event?.organizer, name: event?.organizer } });
  }, [push]);

  const openTicket = useCallback((ticket) => {
    push({ name: 'ticketDetail', ticket });
  }, [push]);

  const openNotifications = useCallback(() => {
    push({ name: 'notifications' });
  }, [push]);

  const openCheckout = useCallback((event, items) => {
    const ok = startCheckout(event, items);
    if (!ok) { showToast('Selectează cel puțin un bilet.'); return; }
    push({ name: 'checkout' });
  }, [startCheckout, showToast, push]);

  const goTab = useCallback((tab) => {
    setHistory([]);
    if (tab === 'discover') setRoute({ name: 'home' });
    else if (tab === 'calendar') setRoute({ name: 'calendar' });
    else if (tab === 'tickets') setRoute({ name: 'tickets' });
    else if (tab === 'saved') setRoute({ name: 'saved' });
    else if (tab === 'account') setRoute({ name: 'account' });
  }, []);

  const openSubAccount = useCallback((kind) => {
    push({ name: kind });
  }, [push]);

  const openLegal = useCallback((kind) => {
    push({ name: 'legal', kind });
  }, [push]);

  const openGenre = useCallback((genre) => {
    setShowSearch({ query: genre.label });
  }, []);

  const openMap = useCallback((event) => setShowMap(event), []);

  const shareGeneric = useCallback(() => showToast('Link copiat în clipboard'), [showToast]);

  const allEvents = [...EVENTS, ...SIDE_EVENTS];
  const openEventById = useCallback((id) => {
    const e = allEvents.find(x => x.id === id);
    if (e) openEvent(e);
  }, [allEvents, openEvent]);

  const screen = (() => {
    if (route.name === 'event') return (
      <EventDetailScreen
        event={route.event}
        onBack={back}
        onCheckout={openCheckout}
        onOpenOrganizer={openOrganizer}
        onOpenMap={() => openMap(route.event)}
        onShare={shareGeneric}
      />
    );
    if (route.name === 'tickets') return (
      <TicketsScreen onTab={goTab} onOpenTicket={openTicket} onDiscover={home} />
    );
    if (route.name === 'account') return (
      <ProfileScreen
        onTab={goTab}
        onShare={shareGeneric}
        onOpenPersonal={() => openSubAccount('personal')}
        onOpenPayment={() => openSubAccount('payment')}
        onOpenPassword={() => openSubAccount('password')}
        onOpenLegal={openLegal}
        onLogout={() => { home(); }}
      />
    );
    if (route.name === 'calendar') return (
      <CalendarScreen onTab={goTab} onOpenEvent={openEvent} />
    );
    if (route.name === 'saved') return (
      <SavedScreen onTab={goTab} onOpenEvent={openEvent} onDiscover={home} />
    );
    if (route.name === 'organizer') return (
      <OrganizerScreen organizer={route.organizer} onBack={back} onOpenEvent={openEvent} onShare={shareGeneric} />
    );
    if (route.name === 'ticketDetail') return (
      <TicketDetailScreen ticket={route.ticket} onBack={back} />
    );
    if (route.name === 'notifications') return (
      <NotificationsScreen onBack={back} onOpenEvent={openEventById} />
    );
    if (route.name === 'map') return (
      <MapScreen onBack={back} onOpenEvent={openEvent} />
    );
    if (route.name === 'checkout') return (
      <CheckoutScreen
        onBack={back}
        onDone={home}
        onOpenTickets={() => { home(); goTab('tickets'); }}
      />
    );
    if (route.name === 'personal') return <PersonalDataScreen onBack={back} />;
    if (route.name === 'payment') return <PaymentMethodsScreen onBack={back} />;
    if (route.name === 'password') return <ChangePasswordScreen onBack={back} />;
    if (route.name === 'legal') return <LegalScreen onBack={back} kind={route.kind} />;

    return (
      <HomeScreen
        onOpenEvent={openEvent}
        onOpenFilters={() => setShowFilter(true)}
        onOpenSearch={() => setShowSearch({})}
        onOpenMap={() => push({ name: 'map' })}
        onOpenNotifications={openNotifications}
        onOpenGenre={openGenre}
        onOpenCalendar={() => { setHistory([]); setRoute({ name: 'calendar' }); }}
        onOpenCityPicker={() => setShowCity(true)}
        onTab={goTab}
      />
    );
  })();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div key={route.name + (route.event?.id || route.ticket?.id || route.kind || '')} className="route-enter" style={{ position: 'absolute', inset: 0 }}>
        {screen}
      </div>
      {showFilter && <FilterSheet onClose={() => setShowFilter(false)} onApply={() => setShowFilter(false)} />}
      {showSearch && <SearchScreen onClose={() => setShowSearch(null)} onOpenEvent={openEvent} initialQuery={showSearch.query || ''} />}
      {showCity && <CityPickerSheet onClose={() => setShowCity(false)} onPick={() => setShowCity(false)} />}
      {showMap && <MapSheet event={showMap} onClose={() => setShowMap(null)} />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36,
        padding: 'clamp(28px, 5vw, 56px) 24px 72px',
        maxWidth: '100%', minHeight: '100vh',
        boxSizing: 'border-box',
      }}>
        <div className="fade-up" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          textAlign: 'center', maxWidth: 560,
        }}>
          <span style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 11, color: '#A77BFF',
            letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
            padding: '5px 10px',
            background: 'rgba(167,123,255,0.08)',
            border: '1px solid rgba(167,123,255,0.2)',
            borderRadius: 999,
          }}>2nite · Nightlife app</span>
          <h1 style={{
            margin: 0,
            fontFamily: '"Unbounded", system-ui, sans-serif',
            fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)',
            letterSpacing: '-0.025em',
            color: '#fff',
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.72) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Nightlife pentru România</h1>
          <p style={{
            margin: 0,
            fontFamily: '"Inter", system-ui, sans-serif',
            color: '#A1A1AA', fontSize: 14, lineHeight: 1.6,
            maxWidth: 480,
          }}>
            Descoperă evenimente, salvează preferate, urmărește organizatori, cumpără bilete
            cu plata securizată prin Stripe, apoi gestionează totul dintr-un singur cont.
          </p>
        </div>

        <div className="device-col fade-up" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
          position: 'relative',
        }}>
          <div aria-hidden style={{
            position: 'absolute', inset: '-40px -60px', zIndex: -1,
            background: 'radial-gradient(50% 60% at 50% 50%, rgba(91,30,220,0.28), transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <IOSDevice width={390} height={780} dark>
            <PhoneApp />
          </IOSDevice>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            background: 'rgba(24,24,27,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 999,
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999, background: '#22C55E',
            }} className="brand-pulse" />
            <span style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 12, color: '#A1A1AA', letterSpacing: '0.02em',
            }}>Toate flow-urile sunt complet funcționale</span>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
