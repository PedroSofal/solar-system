const bgImgs = [
  {
    src: '/img/cover1.png',
    alt: 'Saturno e seus anéis',
  },
  {
    src: '/img/cover2.png',
    alt: 'Planeta Terra',
  },
  {
    src: '/img/cover3.png',
    alt: 'Terra com o Sol ao fundo',
  },
  {
    src: '/img/cover4.png',
    alt: 'Lua com a Terra ao fundo',
  },
];

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-black">
      {bgImgs.map(({ src, alt }, index) => (
        <img
          key={index}
          className="animate-fadeCycle absolute h-full w-full object-cover opacity-0"
          style={{
            animationDuration: `${bgImgs.length * 3}s`,
            animationDelay: `${index * 3}s`,
          }}
          src={src}
          alt={alt}
        />
      ))}

      <h1 className="absolute right-12 bottom-12 z-10 animate-pulse text-right text-xl text-white md:text-2xl xl:text-3xl">
        Carregando...
      </h1>
    </div>
  );
}
