import { useMemo, useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Input, iconBtnGlassStyle } from '../components/Primitives';
import { useApp } from '../state';

const STEPS = [
  { id: 'contact', label: 'Contact' },
  { id: 'payment', label: 'Plată' },
  { id: 'billing', label: 'Facturare' },
];

const CITIES = ['București', 'Cluj-Napoca', 'Iași', 'Timișoara', 'Constanța', 'Brașov', 'Sibiu', 'Oradea'];
const SECTORS = ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6'];

const formatCard = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
const formatExp = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

// =====================================================================
// Reusable design-system pieces
// =====================================================================

function Eyebrow({ children }) {
  return <div style={{
    fontFamily: T.fontInter, fontSize: 11, fontWeight: 700,
    color: T.fg4, letterSpacing: '0.08em', textTransform: 'uppercase',
  }}>{children}</div>;
}

function FormGroup({ label, sub, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <Eyebrow>{label}</Eyebrow>
        {sub && <div style={{
          fontFamily: T.fontInter, fontSize: 12, color: T.fg3, marginTop: 4,
        }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Row({ children, cols = 2, template }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: template || `repeat(${cols}, 1fr)`,
      gap: 10, minWidth: 0,
    }}>
      {children}
    </div>
  );
}

function Select({ label, value, options, onChange, leading }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', minWidth: 0 }}>
      {label && <label style={{
        fontFamily: T.fontInter, fontWeight: 600, fontSize: 11,
        color: T.fg3, letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>{label}</label>}
      <button type="button" onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        borderRadius: 10, padding: '12px 14px',
        border: `1px solid ${T.borderStrong}`,
        background: value ? 'linear-gradient(#27272A, #3F3F46)' : 'transparent',
        color: value ? '#fff' : T.fg3,
        fontFamily: T.fontInter, fontSize: 14,
        cursor: 'pointer', textAlign: 'left',
        transition: 'border-color 160ms cubic-bezier(0.2,0,0,1)',
      }}>
        {leading && <Icon name={leading} size={16} color={T.fg3} />}
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || 'Alege…'}</span>
        <span style={{
          display: 'inline-flex', transition: 'transform 200ms',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <Icon name="chevronDown" size={14} color={T.fg3} />
        </span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
          background: T.bg2, border: `1px solid ${T.borderStrong}`, borderRadius: 12,
          padding: 6, maxHeight: 200, overflow: 'auto',
          boxShadow: '0 18px 48px rgba(0,0,0,0.55)',
        }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '10px 12px', borderRadius: 8,
              background: o === value ? 'rgba(91,30,220,0.18)' : 'transparent',
              border: 0, color: '#fff', cursor: 'pointer',
              fontFamily: T.fontInter, fontSize: 14,
            }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function SegmentedControl({ value, options, onChange }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: 4, padding: 4,
      background: T.bg3, borderRadius: 12,
    }}>
      {options.map(o => {
        const on = o.id === value;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            padding: '10px 8px', borderRadius: 8, border: 0,
            background: on ? T.brand : 'transparent',
            color: '#fff', cursor: 'pointer',
            fontFamily: T.font, fontWeight: on ? 700 : 500, fontSize: 13,
            letterSpacing: '-0.01em',
            transition: 'background 160ms',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// =====================================================================
// Order summary card — sticky at top of every step
// =====================================================================

function OrderSummary({ event, items, total, open, onToggle }) {
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <div style={{
      margin: '0 16px 16px', background: T.bg2, border: `1px solid ${T.border}`,
      borderRadius: 16, overflow: 'hidden',
    }}>
      <button onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: 12, border: 0,
        background: 'transparent', color: '#fff', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 10, flexShrink: 0,
          background: `url(${event.image}) center/cover`,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff',
            letterSpacing: '-0.01em', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{event.title}</div>
          <div style={{
            fontFamily: T.fontInter, fontSize: 12, color: T.fg3, marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{count} {count === 1 ? 'bilet' : 'bilete'} · {event.venue}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 16, color: '#fff' }}>{total} RON</div>
          <div style={{ fontFamily: T.fontInter, fontSize: 10, color: T.brandGlow, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            Detalii <Icon name={open ? 'chevronDown' : 'chevronRight'} size={11} />
          </div>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${T.border}` }}>
          <div style={{ padding: '12px 0 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(it => (
              <div key={it.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg2 }}>
                  {it.qty} × {it.name}
                </span>
                <span style={{ fontFamily: T.font, fontWeight: 600, fontSize: 12, color: '#fff' }}>{it.qty * it.price} RON</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Stepper (3 functional steps)
// =====================================================================

function Stepper({ step }) {
  return (
    <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              height: 3, borderRadius: 999,
              background: done || active ? T.brand : T.bg3,
              transition: 'background 200ms',
            }} />
            <div style={{
              fontFamily: T.fontInter, fontSize: 10, letterSpacing: '0.06em',
              textTransform: 'uppercase', fontWeight: 700,
              color: active ? '#fff' : (done ? T.brandGlow : T.fg4),
            }}>{i + 1}. {s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// =====================================================================
// Step views
// =====================================================================

function ContactStep({ contact, setContact }) {
  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <FormGroup label="Date de contact" sub="Biletele vor fi trimise pe email-ul de mai jos.">
        <Input
          label="Nume complet"
          value={contact.name}
          placeholder="Dumitru Horia-Radu"
          leading="user"
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
        />
        <Row cols={1}>
          <Input
            label="Email"
            type="email"
            value={contact.email}
            placeholder="tu@email.ro"
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
        </Row>
        <Row cols={1}>
          <Input
            label="Telefon"
            type="tel"
            value={contact.phone}
            placeholder="07XX XXX XXX"
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
        </Row>
      </FormGroup>

      <FormGroup label="Adresă" sub="Folosită pentru livrarea biletelor și facturare implicită.">
        <Select
          label="Oraș de reședință"
          leading="mapPin"
          value={contact.city}
          options={CITIES}
          onChange={(city) => setContact({ ...contact, city, sector: city === 'București' ? (contact.sector || SECTORS[0]) : '' })}
        />
        {contact.city === 'București' && (
          <Select
            label="Sector"
            value={contact.sector}
            options={SECTORS}
            onChange={(sector) => setContact({ ...contact, sector })}
          />
        )}
        <Input
          label="Adresă exactă"
          value={contact.address}
          placeholder="Strada, număr, bloc, scară, ap."
          leading="building"
          onChange={(e) => setContact({ ...contact, address: e.target.value })}
        />
      </FormGroup>

      <div style={{
        display: 'flex', gap: 10, padding: 12,
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.16)', borderRadius: 12,
      }}>
        <Icon name="shield" size={16} color={T.success} />
        <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg2, lineHeight: 1.5 }}>
          Datele tale sunt criptate end-to-end. Le poți modifica oricând din Profil.
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ payment, setPayment, card, setCard, savedCards, useSaved, setUseSaved }) {
  const methods = [
    { id: 'apple', label: 'Apple Pay', icon: 'shield', sub: 'Plată cu Face ID' },
    { id: 'card', label: 'Card bancar', icon: 'card', sub: 'Visa · Mastercard · Maestro' },
    { id: 'revolut', label: 'Revolut Pay', icon: 'compass', sub: 'Conectează-te cu Revolut' },
  ];

  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <FormGroup label="Date de plată" sub="Metoda preferată pentru această tranzacție.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {methods.map(m => {
            const on = payment === m.id;
            return (
              <button key={m.id} type="button" onClick={() => setPayment(m.id)} className="press" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 14, cursor: 'pointer',
                background: on ? 'rgba(91,30,220,0.12)' : T.bg2,
                border: `1px solid ${on ? T.brand : T.border}`,
                borderRadius: 14, textAlign: 'left',
                transition: 'all 160ms',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: T.bg3, color: T.brandGlow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><Icon name={m.icon} size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>{m.label}</div>
                  <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>{m.sub}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                  border: `2px solid ${on ? T.brand : T.borderStrong}`,
                  background: on ? T.brand : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{on && <Icon name="check" size={12} color="#fff" />}</div>
              </button>
            );
          })}
        </div>
      </FormGroup>

      {payment === 'card' && (
        <FormGroup label="Detalii card">
          {savedCards.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {savedCards.map(c => {
                const on = useSaved === c.id;
                return (
                  <button key={c.id} type="button" onClick={() => setUseSaved(on ? null : c.id)} className="press" style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                    background: on ? 'rgba(91,30,220,0.12)' : T.bg2,
                    border: `1px solid ${on ? T.brand : T.border}`,
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 42, height: 32, borderRadius: 6,
                      background: `linear-gradient(135deg, ${T.brand}, ${T.brandSoft})`,
                      color: '#fff', fontFamily: T.font, fontWeight: 800, fontSize: 9,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{c.brand.slice(0, 4).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: '#fff' }}>
                        {c.brand} •••• {c.last4}
                      </div>
                      <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg3 }}>Expiră {c.exp}</div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                      border: `2px solid ${on ? T.brand : T.borderStrong}`,
                      background: on ? T.brand : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{on && <Icon name="check" size={10} color="#fff" />}</div>
                  </button>
                );
              })}
              <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4, textAlign: 'center', padding: '4px 0' }}>
                — sau folosește un card nou —
              </div>
            </div>
          )}

          {!useSaved && (
            <>
              <Input
                label="Număr card"
                value={card.number}
                placeholder="1234 5678 9012 3456"
                leading="card"
                onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
              />
              <Row template="3fr 2fr">
                <Input
                  label="Expirare"
                  value={card.exp}
                  placeholder="LL/AA"
                  onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })}
                />
                <Input
                  label="CVC"
                  value={card.cvc}
                  placeholder="123"
                  onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                />
              </Row>
              <Input
                label="Nume pe card"
                value={card.holder}
                placeholder="DUMITRU HORIA"
                onChange={(e) => setCard({ ...card, holder: e.target.value.toUpperCase() })}
              />
            </>
          )}
        </FormGroup>
      )}

      <div style={{
        display: 'flex', gap: 10, padding: 12,
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.16)', borderRadius: 12,
      }}>
        <Icon name="shield" size={16} color={T.success} />
        <div style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg2, lineHeight: 1.5 }}>
          Plată procesată securizat prin Stripe. CVC-ul nu este stocat.
        </div>
      </div>
    </div>
  );
}

function BillingStep({ billing, setBilling, sameAsContact, setSameAsContact, contact }) {
  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <FormGroup label="Detalii facturare" sub="Cui îi este emisă factura?">
        <SegmentedControl
          value={billing.type}
          onChange={(type) => setBilling({ ...billing, type })}
          options={[
            { id: 'person', label: 'Persoană fizică' },
            { id: 'company', label: 'Persoană juridică' },
          ]}
        />
      </FormGroup>

      <FormGroup label="Adresă">
        <button type="button" onClick={() => setSameAsContact(!sameAsContact)} className="press" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 12,
          background: sameAsContact ? 'rgba(91,30,220,0.12)' : T.bg2,
          border: `1px solid ${sameAsContact ? T.brand : T.border}`,
          color: '#fff', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, flexShrink: 0,
            border: `2px solid ${sameAsContact ? T.brand : T.borderStrong}`,
            background: sameAsContact ? T.brand : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{sameAsContact && <Icon name="check" size={11} color="#fff" />}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: '#fff' }}>Aceeași cu datele de contact</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg3 }}>{contact.name} · {contact.city}</div>
          </div>
        </button>

        {!sameAsContact && (
          <>
            {billing.type === 'company' && (
              <>
                <Input
                  label="Denumire firmă"
                  value={billing.company}
                  placeholder="Ex. 2NITE MEDIA S.R.L."
                  leading="building"
                  onChange={(e) => setBilling({ ...billing, company: e.target.value })}
                />
                <Row>
                  <Input
                    label="CUI"
                    value={billing.cui}
                    placeholder="RO12345678"
                    onChange={(e) => setBilling({ ...billing, cui: e.target.value.toUpperCase() })}
                  />
                  <Input
                    label="Nr. Reg. Com."
                    value={billing.regCom}
                    placeholder="J40/123/2020"
                    onChange={(e) => setBilling({ ...billing, regCom: e.target.value })}
                  />
                </Row>
              </>
            )}

            {billing.type === 'person' && (
              <Input
                label="Nume pe factură"
                value={billing.fullName}
                placeholder={contact.name || 'Nume Prenume'}
                leading="user"
                onChange={(e) => setBilling({ ...billing, fullName: e.target.value })}
              />
            )}

            <Input
              label="Adresă"
              value={billing.address}
              placeholder="Stradă, număr, bloc, scară, apartament"
              leading="mapPin"
              onChange={(e) => setBilling({ ...billing, address: e.target.value })}
            />
            <Row>
              <Select
                label="Oraș"
                value={billing.city}
                options={CITIES}
                onChange={(city) => setBilling({ ...billing, city })}
              />
              <Input
                label="Cod poștal"
                value={billing.zip}
                placeholder="010101"
                onChange={(e) => setBilling({ ...billing, zip: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              />
            </Row>
          </>
        )}
      </FormGroup>

      <FormGroup label="Termeni">
        <button type="button" onClick={() => setBilling({ ...billing, terms: !billing.terms })} className="press" style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '12px 14px', borderRadius: 12,
          background: T.bg2,
          border: `1px solid ${billing.terms ? T.brand : T.border}`,
          color: '#fff', cursor: 'pointer', textAlign: 'left',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
            border: `2px solid ${billing.terms ? T.brand : T.borderStrong}`,
            background: billing.terms ? T.brand : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{billing.terms && <Icon name="check" size={11} color="#fff" />}</div>
          <div style={{ flex: 1, fontFamily: T.fontInter, fontSize: 12, color: T.fg2, lineHeight: 1.5 }}>
            Sunt de acord cu <span style={{ color: T.brandGlow }}>Termenii și condițiile</span> și am luat la cunoștință <span style={{ color: T.brandGlow }}>Politica de confidențialitate</span>.
          </div>
        </button>
      </FormGroup>
    </div>
  );
}

function ConfirmationStep({ event, items, total, onOpenTickets, onClose }) {
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <div style={{ padding: '12px 24px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 88, height: 88, borderRadius: 999,
        background: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.4), rgba(34,197,94,0.05))',
        border: '1px solid rgba(34,197,94,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.success,
      }}><Icon name="check" size={42} strokeWidth={2.4} /></div>

      <div>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>Plată reușită</div>
        <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg2, marginTop: 6, lineHeight: 1.5, maxWidth: 280 }}>
          {count} {count === 1 ? 'bilet' : 'bilete'} pentru <b style={{ color: '#fff' }}>{event.title}</b> au fost adăugate în contul tău.
        </div>
      </div>

      <div style={{
        background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: 14, width: '100%', display: 'flex', flexDirection: 'column', gap: 8,
        marginTop: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>Total plătit</span>
          <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>{total} RON</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.fontInter, fontSize: 12, color: T.fg3 }}>Confirmare email</span>
          <span style={{ fontFamily: T.font, fontWeight: 600, fontSize: 12, color: T.brandGlow }}>Trimisă</span>
        </div>
      </div>

      <button onClick={onOpenTickets} className="press" style={{
        marginTop: 18, width: '100%', height: 52,
        background: T.brand, color: '#fff', border: 0, borderRadius: 14,
        fontFamily: T.font, fontWeight: 700, fontSize: 15, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 12px 28px rgba(91,30,220,0.42)',
      }}>Vezi biletele <Icon name="arrowRight" size={16} /></button>

      <button onClick={onClose} className="press" style={{
        width: '100%', height: 46, marginTop: 4,
        background: 'transparent', border: `1px solid ${T.borderStrong}`,
        color: '#fff', borderRadius: 14, cursor: 'pointer',
        fontFamily: T.font, fontWeight: 600, fontSize: 14,
      }}>Înapoi la Descoperă</button>
    </div>
  );
}

// =====================================================================
// Main Checkout screen
// =====================================================================

export function CheckoutScreen({ onBack, onDone, onOpenTickets }) {
  const { cart, completePurchase, clearCart, showToast } = useApp();
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({
    name: 'Dumitru Horia-Radu',
    email: 'horia@2nite.ro',
    phone: '0721 234 567',
    city: 'București',
    sector: 'Sector 1',
    address: '',
  });
  const [payment, setPayment] = useState('apple');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', holder: '' });
  const savedCards = [{ id: 'sc1', brand: 'Visa', last4: '4242', exp: '08/27' }];
  const [useSaved, setUseSaved] = useState('sc1');
  const [billing, setBilling] = useState({
    type: 'person', fullName: '', company: '', cui: '', regCom: '',
    address: '', city: 'București', zip: '', terms: true,
  });
  const [sameAsContact, setSameAsContact] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!cart) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: '#fff' }}>Coș gol</div>
          <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3, marginTop: 6 }}>Selectează un eveniment pentru a continua.</div>
          <button onClick={onBack} style={{
            marginTop: 14, padding: '10px 18px', borderRadius: 999,
            background: T.brand, color: '#fff', border: 0, cursor: 'pointer',
            fontFamily: T.font, fontWeight: 700, fontSize: 13,
          }}>Înapoi</button>
        </div>
      </div>
    );
  }

  const { event, items } = cart;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const fees = { platform: Math.max(2, Math.round(subtotal * 0.04)), processing: 1 };
  const total = subtotal + fees.platform + fees.processing;

  const validContact = useMemo(() => {
    if (!contact.name.trim()) return false;
    if (!/\S+@\S+\.\S+/.test(contact.email)) return false;
    if (contact.phone.trim().length < 6) return false;
    if (!contact.city) return false;
    if (contact.city === 'București' && !contact.sector) return false;
    if (!contact.address.trim()) return false;
    return true;
  }, [contact]);

  const validPayment = useMemo(() => {
    if (payment !== 'card') return true;
    if (useSaved) return true;
    const digits = card.number.replace(/\s/g, '');
    return digits.length >= 12 && /^\d{2}\/\d{2}$/.test(card.exp) && card.cvc.length >= 3 && card.holder.trim();
  }, [payment, card, useSaved]);

  const validBilling = useMemo(() => {
    if (sameAsContact) return billing.terms;
    if (!billing.terms) return false;
    if (!billing.address.trim() || !billing.city || !billing.zip) return false;
    if (billing.type === 'company') return billing.company.trim() && /^RO?\d{2,10}$/i.test(billing.cui.trim());
    return billing.fullName.trim() || contact.name.trim();
  }, [sameAsContact, billing, contact]);

  const stepValid = step === 0 ? validContact : step === 1 ? validPayment : validBilling;

  const handlePrimary = () => {
    if (!stepValid) {
      if (step === 0) showToast('Completează datele de contact.');
      else if (step === 1) showToast('Verifică datele de plată.');
      else showToast('Confirmă termenii și completează adresa.');
      return;
    }
    if (step < 2) { setStep(step + 1); return; }
    setProcessing(true);
    setTimeout(() => {
      completePurchase();
      setProcessing(false);
      setStep(3);
    }, 900);
  };

  const handleBack = () => {
    if (step === 3) return;
    if (step === 0) { clearCart(); onBack(); return; }
    setStep(step - 1);
  };

  const primaryLabel = step === 0 ? 'Continuă spre plată'
    : step === 1 ? 'Continuă spre facturare'
    : processing ? 'Se procesează…'
    : `Plătește ${total} RON`;

  const headerTitle = step === 3 ? 'Confirmare' : `Checkout · ${STEPS[step].label}`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 130 }}>
        <div style={{
          padding: '54px 16px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        }}>
          {step < 3 ? (
            <button onClick={handleBack} style={iconBtnGlassStyle}><Icon name="chevronLeft" size={18} /></button>
          ) : <div style={{ width: 40 }} />}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>
              {headerTitle}
            </div>
          </div>
          <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {step < 3 && (
              <div style={{
                background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 999,
                padding: '4px 8px',
                fontFamily: T.font, fontWeight: 700, fontSize: 11, color: T.brandGlow,
              }}>{step + 1}/3</div>
            )}
          </div>
        </div>

        {step < 3 && <Stepper step={step} />}

        {step < 3 && (
          <div style={{ marginTop: 14 }}>
            <OrderSummary event={event} items={items} total={total} open={summaryOpen} onToggle={() => setSummaryOpen(!summaryOpen)} />
          </div>
        )}

        {step === 0 && <ContactStep contact={contact} setContact={setContact} />}
        {step === 1 && <PaymentStep payment={payment} setPayment={setPayment} card={card} setCard={setCard} savedCards={savedCards} useSaved={useSaved} setUseSaved={setUseSaved} />}
        {step === 2 && (
          <>
            <BillingStep
              billing={billing} setBilling={setBilling}
              sameAsContact={sameAsContact} setSameAsContact={setSameAsContact}
              contact={contact}
            />
            <div style={{ padding: '20px 16px 4px' }}>
              <Eyebrow>Total comandă</Eyebrow>
              <div style={{
                marginTop: 10, padding: 14,
                background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <Line label="Subtotal bilete" value={`${subtotal} RON`} />
                <Line label="Comision platformă" value={`${fees.platform} RON`} />
                <Line label="Procesare plată" value={`${fees.processing} RON`} />
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: '#fff' }}>Total</div>
                  <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 20, color: '#fff' }}>{total} RON</div>
                </div>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <ConfirmationStep
            event={event} items={items} total={total}
            onOpenTickets={() => { clearCart(); onOpenTickets(); }}
            onClose={() => { clearCart(); onDone(); }}
          />
        )}
      </div>

      {step < 3 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
          background: 'linear-gradient(to top, rgba(18,18,18,1) 70%, rgba(18,18,18,0))',
          padding: '20px 16px 24px',
        }}>
          <button onClick={handlePrimary} disabled={processing || !stepValid} className="press" style={{
            width: '100%', height: 54,
            background: stepValid ? T.brand : T.bg3,
            color: '#fff', border: 0, borderRadius: 16,
            fontFamily: T.font, fontWeight: 700, fontSize: 15,
            cursor: processing ? 'wait' : (stepValid ? 'pointer' : 'not-allowed'),
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: stepValid ? '0 12px 28px rgba(91,30,220,0.4)' : 'none',
            opacity: processing ? 0.7 : 1,
            transition: 'all 200ms',
          }}>
            {processing && (
              <span style={{
                width: 16, height: 16, borderRadius: 999,
                border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff',
                animation: 'spin 700ms linear infinite', display: 'inline-block',
              }} />
            )}
            {primaryLabel}
            {!processing && <Icon name="arrowRight" size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}

function Line({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3 }}>{label}</span>
      <span style={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: '#fff' }}>{value}</span>
    </div>
  );
}
