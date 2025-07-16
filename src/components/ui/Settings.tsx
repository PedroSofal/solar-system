import { useContext } from 'react';
import SettingsContext from '../../contexts/SettingsContext';
import Radio from './Radio';

type Option = { label: string; value: SettingsOption['value'] };

const OPTIONS: Option[] = [
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Cheia', value: 'full' },
];

export default function Settings({ isExpanded }: { isExpanded: boolean }) {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleChange = (
    id: SettingsOption['id'],
    value: SettingsOption['value'],
  ) => {
    const updated = settings.map((item) =>
      item.id === id ? { ...item, value } : item,
    );
    setSettings(updated);
  };

  if (!isExpanded) return null;

  return (
    <aside className="main-container mt-6 flex max-h-[70vh] flex-col gap-4 sm:max-w-[20rem]">
      <h1 className="font-semibold text-white">Configurações</h1>
      <hr className="border-emerald-400/50" />
      <ul className="space-y-4 leading-7">
        {settings.map((setting) => (
          <li key={setting.id}>
            <h2 className="mb-2 font-semibold">{setting.label}</h2>
            <div className="flex">
              {OPTIONS.map(({ label, value }) => (
                <Radio
                  key={value}
                  name={setting.id}
                  id={`${setting.id}-${value}`}
                  label={label}
                  value={value}
                  checked={setting.value === value}
                  onChange={() => handleChange(setting.id, value)}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
