import React, { useContext, useEffect, useRef, useState } from 'react';
import TimeContext from '../../contexts/TimeContext';
import Button from './Button';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { fromJulianDate, toJulianDate } from '../../utils';

export default function TimeControls({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    play,
    pause,
    reset,
    modifier,
    updateTimeScale,
    isPaused,
    label,
    isValidTime,
  } = useContext(TimeContext);

  function fixSlider(e: React.DragEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateTimeScale(Number(e.target.value));
    play();
  }

  return (
    <div className="pointer-events-none absolute bottom-0 w-full">
      <div
        className={`flex flex-col items-center px-2 duration-300 ${isExpanded || !isValidTime ? '' : 'invisible translate-y-24 opacity-0'}`}
      >
        {!isValidTime && (
          <div className="mb-4 text-center text-red-500">
            Limite de simulação atingida. Por favor, escolha uma data entre
            01/01/1900 e 31/12/2112.
          </div>
        )}
        <div className="pointer-events-auto relative w-full max-w-96 pb-8">
          <input
            type="range"
            min={-11}
            max={11}
            step={1}
            value={modifier}
            onChange={handleChange}
            className="slider"
            title={label}
            draggable
            onDragStart={fixSlider}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="pointer-events-auto flex justify-center gap-4 md:order-2">
            <Button label="Reset" onClick={reset} title="Tempo ao vivo" />
            <Button
              label={isPaused ? 'Play' : 'Pause'}
              onClick={isPaused ? play : pause}
              title={
                isPaused
                  ? 'Continuar simulação do tempo'
                  : 'Suspender simulação do tempo'
              }
              className="min-w-[8ch]"
            />
          </div>
          <div className="pointer-events-auto grid sm:grid-cols-2 md:contents">
            <span className="mx-6 border-x-2 border-neutral-800 px-10 text-center text-neutral-500 hover:bg-slate-950 sm:border-b-0 md:order-1">
              <Clock />
            </span>
            <span className="mx-6 border-x-2 border-neutral-800 px-10 text-center text-neutral-500 sm:border-t-0 md:order-3">
              {label}
            </span>
          </div>
        </div>
      </div>

      <button
        className="pointer-events-auto mx-auto mt-4 -mb-2 block cursor-pointer p-2 duration-300 hover:-translate-y-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDownIcon className="size-6 text-white" />
        ) : (
          <ChevronUpIcon className="size-6 text-white" />
        )}
      </button>
    </div>
  );
}

function Clock() {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    timerRef,
    setCustomJulianDate,
    checkValidJulianDateSpan,
    isValidTime,
  } = useContext(TimeContext);

  const [time, setTime] = useState(new Date());
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      if (!timerRef.current) return;
      setTime(new Date(fromJulianDate(timerRef.current)));
    };

    const interval = setInterval(updateClock, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  const day = time.toLocaleDateString().replaceAll('/', '-');
  const hour = time.toLocaleTimeString().slice(0, 8);

  function handleDateClick() {
    if (!isInputExpanded) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
    }
    setIsInputExpanded(!isInputExpanded);
  }

  function handleSubmitCustomDate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const dateString = data.get('custom-date') as string;
    const formattedDate = new Date(dateString);
    const jd = toJulianDate(formattedDate.getTime());

    const isValidDate = checkValidJulianDateSpan(jd);

    if (isValidDate) {
      setCustomJulianDate(jd);
      setIsInputExpanded(false);
    }
  }

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleDateClick}
      title="Escolha uma data personalizada"
    >
      <span>{day + ', ' + hour}</span>

      <form
        className={`absolute bottom-[100%] left-[50%] mb-2 -translate-x-[50%] ${isInputExpanded || !isValidTime ? '' : 'hidden'}`}
        onSubmit={handleSubmitCustomDate}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="rounded-full border-2 border-neutral-800 bg-neutral-950 px-4 py-2 text-white"
          name="custom-date"
          type="datetime-local"
          min="1900-01-01T00:00"
          max="2112-12-31T23:59"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsInputExpanded(false);
          }}
        />
        <button className="hidden">Submit</button>
      </form>
    </div>
  );
}
