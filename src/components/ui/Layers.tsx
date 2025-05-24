import { useContext, useEffect, useRef, useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

import LayerContext from '../../contexts/LayerContext';
import Checkbox from './Checkbox';

export default function Layers({ isExpanded }: { isExpanded: boolean }) {
  const { layers, setLayers } = useContext(LayerContext);

  function toggleCheckbox(id: string, checked: boolean) {
    const updateState = (items: LayerOption[]): LayerOption[] => {
      return items.map((item) => {
        if (item.id === id) {
          if (item.subItems) {
            return {
              ...item,
              subItems: item.subItems.map((subItem) => ({
                ...subItem,
                value: checked,
              })),
            };
          }
          return { ...item, value: checked };
        }

        if (item.subItems) {
          return {
            ...item,
            subItems: updateState(item.subItems),
          };
        }

        return item;
      });
    };

    setLayers(updateState(layers));
  }

  return (
    <aside
      className={`main-container absolute top-10 right-0 z-10 mt-6 flex max-h-[70vh] w-[16rem] max-w-full flex-col gap-4 ${!isExpanded ? 'hidden!' : ''}`}
    >
      <h1 className="font-semibold text-white">Camadas</h1>
      <hr className="border-emerald-400/50" />
      <ul className="leading-7">
        {layers.map((option, index) => (
          <CheckboxItem key={index} item={option} onChange={toggleCheckbox} />
        ))}
      </ul>
    </aside>
  );
}

function CheckboxItem({
  item,
  onChange,
}: {
  item: LayerOption;
  onChange: (id: string, checked: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const isChecked = item.subItems
    ? item.subItems.every((subItem) => subItem.value)
    : item.value;

  const isIndeterminate = item.subItems
    ? item.subItems.some((subItem) => subItem.value) &&
      !item.subItems.every((subItem) => subItem.value)
    : false;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <li id="layer-option">
      <div className="flex items-center gap-2">
        <>
          {item.subItems && (
            <button
              className="border p-[1px] hover:border-emerald-200 hover:text-emerald-200"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <MinusIcon className="size-3" />
              ) : (
                <PlusIcon className="size-3" />
              )}
            </button>
          )}
          <Checkbox
            ref={checkboxRef}
            margin={item.subItems ? '' : 'ml-6'}
            id={`${item.id}-checkbox`}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onChange(item.id, e.target.checked)}
          />
          <label
            className={item.subItems ? 'font-semibold' : ''}
            htmlFor={`${item.id}-checkbox`}
          >
            {item.label}
          </label>
        </>
      </div>
      <ul className="ml-8 border-l border-dashed">
        {item.subItems &&
          isExpanded &&
          item.subItems.map((option, index) => (
            <CheckboxItem key={index} item={option} onChange={onChange} />
          ))}
      </ul>
    </li>
  );
}
