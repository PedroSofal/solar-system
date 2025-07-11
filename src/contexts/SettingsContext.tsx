import React, { createContext, useState } from 'react';
import { DEFAULT_SETTINGS_CONFIG } from '../constants/settings';

const SettingsContext = createContext<{
  settings: SettingsOption[];
  setSettings: (obj: SettingsOption[]) => void;
  getSettings: (settingsId: SettingsOption['id']) => SettingsOption | undefined;
}>({
  settings: DEFAULT_SETTINGS_CONFIG,
  setSettings: () => {},
  getSettings: () => undefined,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsOption[]>(
    DEFAULT_SETTINGS_CONFIG,
  );

  function getSettings(settingsId: SettingsOption['id']) {
    return settings.find((config) => config.id === settingsId);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        getSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
