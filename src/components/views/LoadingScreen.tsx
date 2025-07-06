import Logo from '../../assets/logo/logo.svg?react';
import Tagline from '../../assets/logo/tagline.svg?react';

const bgImgs = [
  {
    srcSet: [
      '/img/cover1_1920w.webp',
      '/img/cover1_1080w.webp',
      '/img/cover1_600w.webp',
    ],
    alt: 'Saturno e seus anéis',
  },
  {
    srcSet: [
      '/img/cover2_1920w.webp',
      '/img/cover2_1080w.webp',
      '/img/cover2_600w.webp',
    ],
    alt: 'Planeta Terra com o Sol ao fundo',
  },
  {
    srcSet: [
      '/img/cover3_1920w.webp',
      '/img/cover3_1080w.webp',
      '/img/cover3_600w.webp',
    ],
    alt: 'Planeta Terra com o cometa Halley ao fundo',
  },
  {
    srcSet: [
      '/img/cover4_1920w.webp',
      '/img/cover4_1080w.webp',
      '/img/cover4_600w.webp',
    ],
    alt: 'Planeta Terra',
  },
];

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-black">
      {bgImgs.map(({ srcSet, alt }, index) => (
        <picture
          key={index}
          className="animate-fadeCycle absolute h-full w-full opacity-0"
          style={{
            animationDuration: `${bgImgs.length * 3}s`,
            animationDelay: `${index * 3}s`,
          }}
        >
          <source media="(width > 1080px)" srcSet={srcSet[0]} />
          <source media="(width < 600px)" srcSet={srcSet[2]} />
          <img
            className="h-full w-full object-cover"
            src={srcSet[1]}
            alt={alt}
          />
        </picture>
      ))}

      <div className="absolute inset-0 z-10">
        <div className="flex h-full flex-col place-content-center items-center gap-6 px-8 min-[25rem]:px-20">
          <Logo
            className="animate-logoIn max-w-[30rem] min-w-30 opacity-0"
            style={{ animationDelay: '1s' }}
          />
          <Tagline
            className="animate-logoIn max-w-[18rem] min-w-30 opacity-0"
            style={{ animationDelay: '1.3s' }}
          />
        </div>
      </div>

      <h1 className="absolute right-12 bottom-12 z-10 animate-pulse text-right text-xl text-white md:text-2xl">
        Carregando...
      </h1>
    </div>
  );
}
