import { useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Button, Input, iconBtnGlassStyle } from '../components/Primitives';
import { useApp } from '../state';

function ScreenShell({ title, onBack, children, footer }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: footer ? 110 : 24 }}>
        <div style={{
          padding: '54px 16px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button onClick={onBack} style={iconBtnGlassStyle}><Icon name="chevronLeft" size={18} /></button>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: T.font, fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>
            {title}
          </div>
          <div style={{ width: 40 }} />
        </div>
        {children}
      </div>
      {footer && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 16px 24px',
          background: 'linear-gradient(to top, rgba(18,18,18,1) 60%, rgba(18,18,18,0))',
        }}>{footer}</div>
      )}
    </div>
  );
}

export function PersonalDataScreen({ onBack }) {
  const { showToast } = useApp();
  const [data, setData] = useState({
    name: 'Dumitru Horia-Radu',
    username: 'azteca616ocult',
    email: 'horia@2nite.ro',
    phone: '0721 234 567',
    city: 'București',
  });

  const save = () => {
    showToast('Datele au fost salvate.');
    onBack();
  };

  return (
    <ScreenShell title="Date personale" onBack={onBack} footer={
      <Button onClick={save} fullWidth>Salvează modificările</Button>
    }>
      <div style={{ padding: '8px 20px 16px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 999,
          background: `linear-gradient(135deg, ${T.brand}, ${T.brandSoft})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.font, fontWeight: 800, fontSize: 30, color: '#fff',
          position: 'relative',
        }}>
          HD
          <button onClick={() => showToast('Alege o poză din galerie')} style={{
            position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: 999,
            background: T.bg2, border: `2px solid ${T.bg1}`, color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="plus" size={14} /></button>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Nume complet" value={data.name} leading="user"
          onChange={(e) => setData({ ...data, name: e.target.value })} />
        <Input label="Nume utilizator" value={data.username} leading="user"
          onChange={(e) => setData({ ...data, username: e.target.value })} />
        <Input label="Email" type="email" value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })} />
        <Input label="Telefon" type="tel" value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })} />
        <Input label="Oraș" value={data.city} leading="mapPin"
          onChange={(e) => setData({ ...data, city: e.target.value })} />
      </div>
    </ScreenShell>
  );
}

export function PaymentMethodsScreen({ onBack }) {
  const { showToast } = useApp();
  const [cards, setCards] = useState([
    { id: 'c1', brand: 'Visa', last4: '4242', exp: '08/27', primary: true },
    { id: 'c2', brand: 'Mastercard', last4: '7711', exp: '03/26', primary: false },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ number: '', exp: '', cvc: '', holder: '' });

  const remove = (id) => setCards(prev => {
    const next = prev.filter(c => c.id !== id);
    if (next.length && !next.some(c => c.primary)) next[0].primary = true;
    return next;
  });
  const makePrimary = (id) => setCards(prev => prev.map(c => ({ ...c, primary: c.id === id })));
  const saveCard = () => {
    const digits = draft.number.replace(/\s/g, '');
    if (digits.length < 12 || draft.exp.length < 4 || draft.cvc.length < 3) {
      showToast('Verifică datele cardului.');
      return;
    }
    const id = `c${Date.now()}`;
    setCards(prev => [...prev, {
      id, brand: digits.startsWith('5') ? 'Mastercard' : 'Visa',
      last4: digits.slice(-4), exp: draft.exp, primary: prev.length === 0,
    }]);
    setDraft({ number: '', exp: '', cvc: '', holder: '' });
    setAdding(false);
    showToast('Card adăugat.');
  };

  return (
    <ScreenShell title="Metode de plată" onBack={onBack}>
      <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cards.map(c => (
          <div key={c.id} style={{
            background: T.bg2, border: `1px solid ${c.primary ? T.brand : T.border}`,
            borderRadius: 16, padding: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: `linear-gradient(135deg, ${T.brand}, ${T.brandSoft})`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: '0.04em',
            }}>{c.brand.slice(0, 4).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>
                {c.brand} •••• {c.last4}
              </div>
              <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3, marginTop: 2 }}>
                Expiră {c.exp}{c.primary ? ' · principal' : ''}
              </div>
            </div>
            {!c.primary && (
              <button onClick={() => makePrimary(c.id)} className="press" style={{
                background: 'transparent', border: `1px solid ${T.borderStrong}`,
                borderRadius: 999, padding: '6px 10px', color: T.fg2, cursor: 'pointer',
                fontFamily: T.font, fontWeight: 600, fontSize: 11,
              }}>Setează</button>
            )}
            <button onClick={() => remove(c.id)} className="press" style={{
              background: 'transparent', border: 0, color: T.fg4, cursor: 'pointer',
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="x" size={14} /></button>
          </div>
        ))}

        {!adding ? (
          <button onClick={() => setAdding(true)} className="press" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'transparent', border: `1.5px dashed ${T.borderStrong}`,
            borderRadius: 14, padding: '16px', color: '#fff', cursor: 'pointer',
            fontFamily: T.font, fontWeight: 600, fontSize: 14,
          }}><Icon name="plus" size={16} /> Adaugă un card nou</button>
        ) : (
          <div style={{
            background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>Card nou</div>
            <Input label="Număr card" value={draft.number} placeholder="1234 5678 9012 3456"
              onChange={(e) => setDraft({ ...draft, number: e.target.value })} />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Input label="Expirare" value={draft.exp} placeholder="MM/AA"
                  onChange={(e) => setDraft({ ...draft, exp: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <Input label="CVC" value={draft.cvc} placeholder="123"
                  onChange={(e) => setDraft({ ...draft, cvc: e.target.value })} />
              </div>
            </div>
            <Input label="Nume pe card" value={draft.holder} placeholder="DUMITRU HORIA"
              onChange={(e) => setDraft({ ...draft, holder: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" size="sm" onClick={() => setAdding(false)}>Renunță</Button>
              <Button onClick={saveCard} size="sm" style={{ flex: 1 }}>Salvează card</Button>
            </div>
          </div>
        )}

        <div style={{
          padding: 14, marginTop: 8,
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.16)', borderRadius: 12,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Icon name="shield" size={16} color={T.success} />
          <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg2, lineHeight: 1.5 }}>
            Datele cardurilor sunt criptate și păstrate în siguranță. 2nite nu stochează CVC-ul.
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

export function ChangePasswordScreen({ onBack }) {
  const { showToast } = useApp();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const strength = (() => {
    const p = pw.next;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const submit = () => {
    if (!pw.current) { showToast('Introdu parola curentă.'); return; }
    if (pw.next.length < 8) { showToast('Parola nouă trebuie să aibă minim 8 caractere.'); return; }
    if (pw.next !== pw.confirm) { showToast('Parolele nu coincid.'); return; }
    showToast('Parola a fost schimbată.');
    onBack();
  };

  return (
    <ScreenShell title="Schimbă parola" onBack={onBack} footer={
      <Button onClick={submit} fullWidth>Schimbă parola</Button>
    }>
      <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Parola actuală" type={show.current ? 'text' : 'password'} value={pw.current}
          placeholder="••••••••" trailing={show.current ? 'eye' : 'eyeOff'}
          onChange={(e) => setPw({ ...pw, current: e.target.value })} />

        <Input label="Parola nouă" type={show.next ? 'text' : 'password'} value={pw.next}
          placeholder="Minim 8 caractere" trailing={show.next ? 'eye' : 'eyeOff'}
          onChange={(e) => setPw({ ...pw, next: e.target.value })} />

        <div style={{ display: 'flex', gap: 4, marginTop: -8 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: strength > i ? (strength >= 3 ? T.success : strength === 2 ? T.warning : T.error) : T.bg3,
              transition: 'background 200ms',
            }} />
          ))}
        </div>
        <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4, marginTop: -8 }}>
          {strength === 0 && 'Introdu o parolă'}
          {strength === 1 && 'Slabă · adaugă majuscule, cifre sau simboluri'}
          {strength === 2 && 'Acceptabilă'}
          {strength === 3 && 'Bună'}
          {strength === 4 && 'Excelentă'}
        </div>

        <Input label="Confirmă parola nouă" type={show.confirm ? 'text' : 'password'} value={pw.confirm}
          placeholder="Reintrodu parola"
          onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
      </div>
    </ScreenShell>
  );
}

export function LegalScreen({ onBack, kind }) {
  const titles = {
    terms: 'Termeni și condiții',
    privacy: 'Politica de confidențialitate',
  };
  const updated = '15 sept. 2025';
  const sections = kind === 'terms' ? [
    { h: 'Acceptare', p: 'Folosirea aplicației 2nite implică acceptarea acestor termeni. Vârsta minimă pentru utilizare este 16 ani, iar accesul în locații este permis conform restricțiilor afișate de fiecare organizator.' },
    { h: 'Bilete', p: 'Biletul electronic livrat de 2nite este nominal și nu poate fi transferat fără acordul organizatorului. Verificarea la intrare se face exclusiv prin codul QR din aplicație.' },
    { h: 'Plăți și retururi', p: 'Plățile sunt procesate securizat. Retururile sunt gestionate de organizator în caz de anulare. 2nite virează banii în maxim 14 zile lucrătoare după aprobare.' },
    { h: 'Comportament', p: 'Este interzisă revânzarea biletelor în afara platformei. Conturile implicate în fraude sau botting vor fi suspendate.' },
  ] : [
    { h: 'Date colectate', p: 'Colectăm doar datele necesare pentru funcționarea aplicației: nume, email, telefon, oraș și istoricul biletelor.' },
    { h: 'Cum folosim datele', p: 'Datele sunt folosite pentru livrarea biletelor, notificări legate de evenimente și îmbunătățirea recomandărilor. Nu vindem date către terți.' },
    { h: 'Drepturile tale', p: 'Poți accesa, modifica sau șterge datele tale în orice moment din ecranul Profil. Pentru cereri scrise: privacy@2nite.ro.' },
    { h: 'Cookies', p: 'Aplicația folosește exclusiv cookies funcționale, necesare autentificării și menținerii sesiunii.' },
  ];

  return (
    <ScreenShell title={titles[kind]} onBack={onBack}>
      <div style={{ padding: '8px 24px 32px' }}>
        <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Actualizat la {updated}
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {sections.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.01em' }}>
                {i + 1}. {s.h}
              </div>
              <p style={{ margin: '6px 0 0', fontFamily: T.fontInter, fontSize: 13, color: T.fg2, lineHeight: 1.55 }}>{s.p}</p>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 24, padding: 14,
          background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 12,
          fontFamily: T.fontInter, fontSize: 12, color: T.fg3,
        }}>
          Pentru întrebări scrie-ne la <span style={{ color: T.brandGlow }}>hello@2nite.ro</span>.
        </div>
      </div>
    </ScreenShell>
  );
}

export function MapSheet({ event, onClose }) {
  const { showToast } = useApp();
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bg1, borderRadius: '24px 24px 0 0',
        border: `1px solid ${T.border}`, borderBottom: 'none',
        animation: 'sheetIn 280ms cubic-bezier(0.2,0,0,1)',
        display: 'flex', flexDirection: 'column', gap: 16, padding: '14px 20px 28px',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: T.bg4, alignSelf: 'center' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>{event.venue}</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, marginTop: 2 }}>{event.address}, {event.city}</div>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 999,
            background: T.bg2, border: `1px solid ${T.border}`,
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="x" size={14} /></button>
        </div>

        <div style={{
          height: 220, borderRadius: 14, position: 'relative', overflow: 'hidden',
          background: `
            linear-gradient(135deg, rgba(91,30,220,0.35), rgba(167,123,255,0.15)),
            repeating-linear-gradient(45deg, ${T.bg2} 0 14px, ${T.bg3} 14px 28px)
          `,
          border: `1px solid ${T.border}`,
        }}>
          <svg viewBox="0 0 320 220" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}>
            <path d="M 0 90 L 120 70 L 200 110 L 320 80" stroke={T.fg4} strokeWidth="1.2" fill="none" />
            <path d="M 0 150 L 90 140 L 180 170 L 320 150" stroke={T.fg4} strokeWidth="1.2" fill="none" />
            <path d="M 70 0 L 80 220" stroke={T.fg4} strokeWidth="1.2" fill="none" />
            <path d="M 210 0 L 230 220" stroke={T.fg4} strokeWidth="1.2" fill="none" />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: T.brand,
              boxShadow: '0 8px 22px rgba(91,30,220,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', border: '2px solid #fff',
            }}><Icon name="mapPin" size={16} /></div>
            <div style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 11, color: '#fff',
              padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(10px)',
            }}>{event.venue}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => showToast(`Direcții deschise în Maps spre ${event.venue}`)} className="press" style={{
            flex: 1, padding: '14px', borderRadius: 14, background: T.brand, color: '#fff',
            border: 0, cursor: 'pointer',
            fontFamily: T.font, fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><Icon name="compass" size={16} /> Direcții</button>
          <button onClick={() => showToast('Adresă copiată')} className="press" style={{
            padding: '14px 18px', borderRadius: 14, background: T.bg2, color: '#fff',
            border: `1px solid ${T.borderStrong}`, cursor: 'pointer',
            fontFamily: T.font, fontWeight: 600, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><Icon name="share" size={16} /></button>
        </div>
      </div>
    </div>
  );
}
