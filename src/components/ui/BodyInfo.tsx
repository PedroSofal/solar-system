import AphelionIcon from '../../assets/icons/aphelion.svg?react';
import AvgTempIcon from '../../assets/icons/avg-temp.svg?react';
import AxialTiltIcon from '../../assets/icons/axial-tilt.svg?react';
import DensityIcon from '../../assets/icons/density.svg?react';
import EccentricityIcon from '../../assets/icons/eccentricity.svg?react';
import GravityIcon from '../../assets/icons/gravity.svg?react';
import InclinationIcon from '../../assets/icons/inclination.svg?react';
import MassIcon from '../../assets/icons/mass.svg?react';
import MeanRadiusIcon from '../../assets/icons/mean-radius.svg?react';
import PerihelionIcon from '../../assets/icons/perihelion.svg?react';
import SiderealOrbitIcon from '../../assets/icons/sidereal-orbit.svg?react';
import SiderealRotationIcon from '../../assets/icons/sidereal-rotation.svg?react';
import MoonIcon from '../../assets/icons/moon.svg?react';
import { InformationCircleIcon } from '@heroicons/react/16/solid';
import {
  ViewfinderCircleIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

import Button from './Button';
import ButtonCheckbox from './CheckboxButton';

import { useContext, useEffect, useMemo, useState } from 'react';

import BodyDataContext from '../../contexts/BodyDataContext';
import CameraContext from '../../contexts/CameraContext';
import { Description } from './Description';
import { Link } from 'react-router-dom';

interface InfoItemType {
  icon: React.ReactNode;
  label: string;
  value?: string;
  tooltip?: string;
  selectNewBody?: () => any;
}

interface InfoTableType {
  label: string;
  data: InfoItemType[];
}

function constructBodyInfo(body: BodyType) {
  return [
    body.meanRadius
      ? {
          icon: <MeanRadiusIcon />,
          label: 'Raio médio',
          value: `${body.meanRadius.toLocaleString()} km`,
          tooltip: 'Média entre os raios equatorial e polar.',
        }
      : null,

    body.obliquity.axialTilt
      ? {
          icon: <AxialTiltIcon />,
          label: 'Obliquidade',
          value: `${body.obliquity.axialTilt.toLocaleString()}°`,
          tooltip: 'Inclinação do eixo de rotação em relação ao eixo orbital.',
        }
      : null,

    body.sideralRotation
      ? {
          icon: <SiderealRotationIcon />,
          label: 'Período de rotação',
          value: `${body.sideralRotation.toLocaleString()} horas
              ${body.obliquity.axialTilt > 90 ? '(retrógrado)' : ''}`,
          tooltip: 'Tempo para dar um volta em torno de si.',
        }
      : null,

    body.gravity
      ? {
          icon: <GravityIcon />,
          label: 'Gravidade',
          value: `${body.gravity.toLocaleString()} m/s²`,
          tooltip: 'Aceleração gravitacional medida na superfície do equador.',
        }
      : null,

    body.mass
      ? {
          icon: <MassIcon />,
          label: 'Massa',
          value: `${body.mass.massValue.toLocaleString()} x 10^${body.mass.massExponent} kg`,
          tooltip:
            'Grandeza associada à medida da inércia, quantidade de matéria, e força gravitacional.',
        }
      : null,

    body.density
      ? {
          icon: <DensityIcon />,
          label: 'Densidade',
          value: `${body.density.toLocaleString()} g/cm³`,
          tooltip: 'Resultado da divisão da massa pelo volume.',
        }
      : null,

    body.avgTemp
      ? {
          icon: <AvgTempIcon />,
          label: 'Temperatura',
          value: `${(body.avgTemp - 273).toLocaleString()} °C`,
          tooltip: 'Temperatura média medida na superfície.',
        }
      : null,
  ].filter((info) => info !== null);
}

function constructOrbitInfo(body: BodyType) {
  return [
    body.sideralOrbit
      ? {
          icon: <SiderealOrbitIcon />,
          label: 'Período orbital',
          value: `${body.sideralOrbit.toLocaleString()} dias ${body.inclination > 90 ? '(retrógrado)' : ''}`,
          tooltip: 'Tempo para dar uma volta completa em torno do objeto-pai.',
        }
      : null,
    body.eccentricity
      ? {
          icon: <EccentricityIcon />,
          label: 'Excentricidade',
          value: body.eccentricity.toLocaleString(),
          tooltip:
            'Parâmetro adimensional que determina o quanto a órbita se desvia de um círculo perfeito.',
        }
      : null,
    body.inclination
      ? {
          icon: <InclinationIcon />,
          label: 'Inclinação orbital',
          value:
            `${body.inclination.toLocaleString()}°` +
            `${body.parent && body.id !== 'moon' ? ` do equador de ${body.parent.name}` : ' da eclíptica'}`,
          tooltip:
            'Ângulo entre o plano orbital e um plano de referência: a eclíptica (plano em que a Terra orbita o Sol) ou o plano do equador do objeto-pai.',
        }
      : null,
    body.perihelion
      ? {
          icon: <PerihelionIcon />,
          label: 'Pericentro',
          value: `${body.perihelion.toLocaleString()} km`,
          tooltip: 'Ponto da órbita mais próximo do objeto-pai.',
        }
      : null,
    body.aphelion
      ? {
          icon: <AphelionIcon />,
          label: 'Apocentro',
          value: `${body.aphelion.toLocaleString()} km`,
          tooltip: 'Ponto da órbita mais distante do objeto-pai.',
        }
      : null,
  ].filter((info) => info !== null);
}

function formatBodyType(bodyType: BodyTypeOptions) {
  switch (bodyType) {
    case 'planet':
      return 'Planeta';
    case 'moon':
      return 'Satélite Natural';
    case 'dwarf-planet':
      return 'Planeta-anão';
    case 'asteroid':
      return 'Asteróide';
    case 'comet':
      return 'Cometa';
    case 'star':
      return 'Estrela';
  }
}

export default function BodyInfo({
  selectedBody,
  setSelectedBody,
}: {
  selectedBody: string;
  setSelectedBody: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}) {
  const [body, setBody] = useState<BodyType>();

  const { allBodies } = useContext(BodyDataContext);
  const { isFollowing, setIsFollowing, handleFocus } =
    useContext(CameraContext);

  useEffect(() => {
    const foundBody = allBodies?.find((body) => body.id === selectedBody);

    if (foundBody) {
      setBody(foundBody);
    } else {
      setSelectedBody(null);
    }
  }, [selectedBody]);

  function goBack() {
    setSelectedBody(undefined);
  }

  if (!body) return null;

  return (
    <>
      <div className="mt-6">
        <Button label="Voltar" onClick={goBack} />
      </div>
      <div
        style={{ direction: 'rtl' }}
        className="mt-6 flex h-[80vh] max-w-96 flex-col gap-6 overflow-y-scroll pl-6"
      >
        <div className="absolute left-[2px] h-[80vh] w-[1px] bg-emerald-400/50"></div>
        <div className="contents" style={{ direction: 'ltr' }}>
          <div>
            <div className="mb-1 font-semibold text-emerald-400">
              {formatBodyType(body.bodyType)}
            </div>
            <h1 className="flex items-end gap-2">
              <div className="title border-bottom gradient-bg w-fit px-4 py-2">
                {body.name}
              </div>
              <nav>
                <Link to={`corpos/${body.id}`}>
                  <Button
                    icon={<RocketLaunchIcon className="size-6" />}
                    className="secondary-btn-clr"
                    title={`Navegar até ${body.name}`}
                    onClick={() => handleFocus(body.id)}
                  />
                </Link>
              </nav>
              <ButtonCheckbox
                icon={<ViewfinderCircleIcon className="size-6" />}
                className="secondary-btn-clr"
                title="Acompanhar movimento orbital"
                checked={isFollowing}
                onChange={(e) => setIsFollowing(e.target.checked)}
              />
            </h1>
          </div>
          {body.description && <Description>{body.description}</Description>}
        </div>

        <InfoTable body={body} setSelectedBody={setSelectedBody} />

        <div className="contents" style={{ direction: 'ltr' }}>
          {body.discoveredBy && body.discoveryDate && (
            <p className="text-sm text-white">
              Descoberto por {body.discoveredBy} em {body.discoveryDate}.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function InfoTable({
  body,
  setSelectedBody,
}: {
  body: BodyType;
  setSelectedBody: (id: string) => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);

  const bodyInfo: InfoItemType[] = useMemo(
    () => constructBodyInfo(body),
    [body],
  );

  const orbitInfo: InfoItemType[] = useMemo(
    () => constructOrbitInfo(body),
    [body],
  );

  const moonsInfo: InfoItemType[] = useMemo(() => {
    return body.moonBodies
      ? body.moonBodies.map((moon) => ({
          icon: <MoonIcon />,
          label: moon.name,
          selectNewBody: () => {
            setSelectedBody(moon.id);
          },
        }))
      : [];
  }, [body]);

  const tabs: InfoTableType[] = useMemo(
    () => [
      { label: 'Corpo', data: bodyInfo },
      { label: 'Órbita', data: orbitInfo },
      ...(body.moonBodies && body.moonBodies.length > 0
        ? [
            {
              label: `Luas (${body.moonBodies.length})`,
              data: moonsInfo,
            },
          ]
        : []),
    ],
    [bodyInfo, orbitInfo, moonsInfo],
  );

  const safeIndex = tabIndex >= tabs.length ? 0 : tabIndex;

  return (
    <div style={{ direction: 'ltr' }}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {tabs.map(({ label }, index) => (
          <ButtonCheckbox
            key={label}
            className="w-full"
            label={label}
            checked={safeIndex === index}
            onChange={() => setTabIndex(index)}
          />
        ))}
      </div>
      <ul className="main-container block max-h-[28rem] overflow-y-auto !p-0 !py-3">
        {tabs[safeIndex].data.map((info, index) => (
          <InfoItem key={index} {...info} />
        ))}
      </ul>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  tooltip,
  selectNewBody,
}: InfoItemType) {
  function handleClick() {
    if (selectNewBody) selectNewBody();
  }

  return (
    <li
      className={`flex items-start gap-4 px-6 py-3 hover:bg-slate-900 ${selectNewBody ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      title={selectNewBody ? `Navegar até ${label}` : ''}
    >
      <div className="flex w-12 shrink-0 items-center rounded-full border-1 border-emerald-400/40 bg-radial from-sky-500/40 to-transparent text-white">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <p className="flex items-center">
          <span className="font-semibold text-emerald-400 uppercase">
            {label}
          </span>
          {tooltip && (
            <InformationCircleIcon
              className="ml-1 size-3 cursor-help text-sky-500"
              title={tooltip}
            />
          )}
        </p>
        {value && <p className="text-white">{value}</p>}
      </div>
    </li>
  );
}
