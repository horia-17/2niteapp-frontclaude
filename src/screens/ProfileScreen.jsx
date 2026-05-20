import { useState } from 'react';
import { T } from '../theme';
import { Icon } from '../components/Icon';
import { Button, iconBtnGlassStyle } from '../components/Primitives';
import { BottomNav, SectionLabel } from '../components/EventComponents';
import { useApp } from '../state';

function Stat({ value, label }) {
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start',
    }}>
      <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: '#fff' }}>{value}</div>
      <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <div style={{ padding: '0 20px 16px' }}>
      <SectionLabel>{title}</SectionLabel>
      <div style={{
        marginTop: 8,
        background: T.bg2, border: `1px solid ${T.border}`,
        borderRadius: 14, overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

function SettingRow({ icon, label, sub, value, toggle, last, onClick, initialOn = true }) {
  const [on, setOn] = useState(initialOn);
  return (
    <div onClick={!toggle ? onClick : undefined} className={!toggle && onClick ? 'press' : ''} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
      cursor: !toggle && onClick ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: T.bg3, color: T.brandGlow,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><Icon name={icon} size={16} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontWeight: 500, fontSize: 14, color: '#fff' }}>{label}</div>
        {sub && <div style={{ fontFamily: T.fontInter, fontSize: 11, color: T.fg4 }}>{sub}</div>}
      </div>
      {value && <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.fg3 }}>{value}</div>}
      {toggle && (
        <button onClick={() => setOn(!on)} style={{
          width: 42, height: 26, borderRadius: 999,
          background: on ? T.brand : T.bg4, border: 'none',
          position: 'relative', cursor: 'pointer', transition: 'all 200ms',
        }}>
          <div style={{
            position: 'absolute', top: 3, left: on ? 19 : 3,
            width: 20, height: 20, borderRadius: 999, background: '#fff',
            transition: 'left 200ms',
          }} />
        </button>
      )}
      {!toggle && !value && <Icon name="chevronRight" size={16} color={T.fg4} />}
    </div>
  );
}

function ConfirmSheet({ title, message, danger, confirmLabel, onConfirm, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bg1, borderRadius: '24px 24px 0 0',
        border: `1px solid ${T.border}`, borderBottom: 'none',
        padding: '14px 20px 28px',
        animation: 'sheetIn 280ms cubic-bezier(0.2,0,0,1)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: T.bg4, alignSelf: 'center' }} />
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>{title}</div>
        <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg2, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Button variant="secondary" onClick={onClose} fullWidth>Anulează</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} fullWidth>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function ProfileScreen({ onTab, onShare, onOpenPersonal, onOpenPayment, onOpenPassword, onOpenLegal, onLogout }) {
  const { tickets, saved, follows, showToast } = useApp();
  const [confirm, setConfirm] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: T.bg1, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 120 }}>
        <div style={{ padding: '64px 20px 24px' }}>
          <h1 style={{ margin: 0, fontFamily: T.font, fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: '#fff' }}>Profilul meu</h1>
        </div>

        <div style={{ padding: '0 20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: `linear-gradient(135deg, ${T.brand}, ${T.brandSoft})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.font, fontWeight: 800, fontSize: 24, color: '#fff',
          }}>HD</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 18, color: '#fff' }}>azteca616ocult</div>
            <div style={{ fontFamily: T.fontInter, fontSize: 13, color: T.fg3 }}>București · {tickets.length} {tickets.length === 1 ? 'eveniment' : 'evenimente'}</div>
          </div>
          <button onClick={onShare} style={iconBtnGlassStyle}><Icon name="share" size={18} /></button>
        </div>

        <div style={{ padding: '0 20px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <Stat value={tickets.length} label="Bilete" />
          <Stat value={saved.size} label="Salvate" />
          <Stat value={follows.size} label="Urmărite" />
        </div>

        <SettingsGroup title="Setări generale">
          <SettingRow icon="user" label="Date personale" sub="Nume, email, telefon" onClick={onOpenPersonal} />
          <SettingRow icon="mapPin" label="Oraș preferat" value="București" onClick={() => showToast('Schimbă orașul din Filtre')} />
          <SettingRow icon="bell" label="Notificări" sub="Evenimente noi, mementouri" toggle last />
        </SettingsGroup>

        <SettingsGroup title="Securitate">
          <SettingRow icon="shield" label="Schimbă parola" onClick={onOpenPassword} />
          <SettingRow icon="ticket" label="Metode de plată" sub="•••• 4242" onClick={onOpenPayment} last />
        </SettingsGroup>

        <SettingsGroup title="Aplicație">
          <SettingRow icon="more" label="Termeni și condiții" onClick={() => onOpenLegal('terms')} />
          <SettingRow icon="shield" label="Politica de confidențialitate" onClick={() => onOpenLegal('privacy')} last />
        </SettingsGroup>

        <div style={{ padding: '0 20px 12px' }}>
          <Button variant="secondary" fullWidth onClick={() => setConfirm({
            title: 'Deconectare', message: 'Vei reveni la ecranul de autentificare. Biletele tale rămân în siguranță.',
            confirmLabel: 'Deconectează', danger: false,
            onConfirm: () => { setConfirm(null); onLogout(); showToast('Deconectat'); },
          })}>Deconectare</Button>
        </div>
        <div style={{ padding: '0 20px' }}>
          <button onClick={() => setConfirm({
            title: 'Șterge contul', message: 'Această acțiune este permanentă. Biletele active rămân valabile, dar profilul tău și istoricul vor fi șterse definitiv.',
            confirmLabel: 'Șterge contul', danger: true,
            onConfirm: () => { setConfirm(null); showToast('Cerere trimisă către suport.'); },
          })} style={{
            width: '100%', padding: 14, borderRadius: 999,
            background: 'transparent', border: 'none',
            fontFamily: T.font, fontWeight: 600, fontSize: 13,
            color: T.error, cursor: 'pointer',
          }}>Șterge contul</button>
        </div>
      </div>
      <BottomNav active="account" onChange={onTab} />
      {confirm && <ConfirmSheet {...confirm} onClose={() => setConfirm(null)} />}
    </div>
  );
}
