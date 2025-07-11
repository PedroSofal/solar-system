import { useContext } from 'react';
import SettingsContext from '../../contexts/SettingsContext';
import Radio from './Radio';

export default function Settings({ isExpanded }: { isExpanded: boolean }) {
  const { settings, setSettings } = useContext(SettingsContext);

  function handleChange(
    id: SettingsOption['id'],
    value: SettingsOption['value'],
    checked: boolean,
  ) {
    const updateState = (items: SettingsOption[]): SettingsOption[] => {
      return items.map((item) => {
        if (item.id === id && checked) {
          return { ...item, value: value };
        }

        return item;
      });
    };

    setSettings(updateState(settings));
  }

  return (
    <aside
      className={`main-container mt-6 flex max-h-[70vh] max-w-[20rem] flex-col gap-4 ${!isExpanded ? 'hidden!' : ''}`}
    >
      <h1 className="font-semibold text-white">Configurações</h1>
      <hr className="border-emerald-400/50" />
      <ul className="leading-7">
        {settings.map((item) => (
          <Item key={item.id} item={item} onChange={handleChange} />
        ))}
      </ul>
    </aside>
  );
}

function Item({
  item,
  onChange,
}: {
  item: SettingsOption;
  onChange: (
    id: SettingsOption['id'],
    value: SettingsOption['value'],
    checked: boolean,
  ) => void;
}) {
  const { id: name, value, label } = item;
  const options: { label: string; option: SettingsOption['value'] }[] = [
    { label: 'Baixa', option: 'low' },
    { label: 'Média', option: 'medium' },
    { label: 'Cheia', option: 'full' },
  ];

  return (
    <li>
      <h2 className="font-semibold">{label}</h2>
      <div className="mt-2 flex w-full">
        {options.map(({ label, option }) => (
          <Radio
            key={option}
            name={name}
            id={`${name}-${option}`}
            value={option}
            label={label}
            onChange={(e) => onChange(name, option, e.target.checked)}
            defaultChecked={value === option}
          />
        ))}
      </div>
    </li>
  );
}
