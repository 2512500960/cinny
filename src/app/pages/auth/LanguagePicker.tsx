import React, { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  PopOut,
  Menu,
  MenuItem,
  IconButton,
  Icon,
  Icons,
  Header,
  Text,
  RectCords,
  config,
} from 'folds';
import FocusTrap from 'focus-trap-react';

const languages: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'de', label: 'Deutsch' },
];

export function LanguagePicker() {
  const { i18n, t } = useTranslation();
  const current = (i18n.language || 'en').split('-')[0];
  const [anchor, setAnchor] = useState<RectCords | undefined>(undefined);

  const handleOpen: MouseEventHandler<HTMLElement> = (evt) => {
    const target = evt.currentTarget.parentElement ?? evt.currentTarget;
    setAnchor(target.getBoundingClientRect());
  };

  const handleSelect: MouseEventHandler<HTMLButtonElement> = (evt) => {
    const lang = evt.currentTarget.getAttribute('data-lang');
    if (lang) {
      void i18n.changeLanguage(lang);
      try {
        localStorage.setItem('i18nextLng', lang);
        // also store as a cookie so it can live alongside other client cookies
        try {
          const maxAge = 60 * 60 * 24 * 365; // 1 year
          document.cookie = `i18next=${encodeURIComponent(
            lang
          )};path=/;max-age=${maxAge};SameSite=Lax`;
        } catch (e) {
          // ignore cookie errors
        }
      } catch (e) {
        // ignore
      }
    }
    setAnchor(undefined);
  };

  const currentLabel = languages.find((l) => l.code === current)?.label ?? current;

  return (
    <Input
      value={currentLabel}
      variant="Background"
      outlined
      readOnly
      size="500"
      style={{ paddingRight: config.space.S200, minWidth: 200 }}
      after={
        <PopOut
          anchor={anchor}
          position="Bottom"
          align="End"
          offset={4}
          content={
            <FocusTrap
              focusTrapOptions={{
                initialFocus: false,
                onDeactivate: () => setAnchor(undefined),
                clickOutsideDeactivates: true,
              }}
            >
              <Menu>
                <Header size="300" style={{ padding: `0 ${config.space.S200}` }}>
                  <Text size="L400">{t('Pages.LanguagePicker.title')}</Text>
                </Header>
                <div style={{ padding: config.space.S100, paddingTop: 0 }}>
                  {languages.map((l) => (
                    <MenuItem
                      key={l.code}
                      radii="300"
                      aria-pressed={l.code === current}
                      data-lang={l.code}
                      onClick={handleSelect}
                    >
                      <Text>{l.label}</Text>
                    </MenuItem>
                  ))}
                </div>
              </Menu>
            </FocusTrap>
          }
        >
          <IconButton onClick={handleOpen} variant="Surface" size="300" radii="300">
            <Icon src={Icons.ChevronBottom} />
          </IconButton>
        </PopOut>
      }
    />
  );
}
