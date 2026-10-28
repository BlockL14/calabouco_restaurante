import { assetUrl } from '../lib/images';

// Logo oficial da casa, na versão para fundo escuro gerada por `npm run logo`
// (brasão nas cores originais, nome em creme). Arquivos em public/logo/.

type Variant = { file: string; w: number; h: number; widths: [number, number] };

const VARIANTS = {
  brasao: { file: 'brasao', w: 287, h: 217, widths: [96, 192] },
  nome: { file: 'nome', w: 369, h: 116, widths: [369, 738] },
  completa: { file: 'logo-escuro', w: 369, h: 372, widths: [369, 738] },
} satisfies Record<string, Variant>;

type LogoProps = {
  variant: keyof typeof VARIANTS;
  /** Texto alternativo; '' quando o nome já está escrito ao lado. */
  alt: string;
  className?: string;
  priority?: boolean;
};

export function Logo({ variant, alt, className, priority = false }: LogoProps) {
  const v: Variant = VARIANTS[variant];
  // O brasão é exportado por altura (96 e 192 px); os demais por largura (1x e 2x)
  const src = (n: number, ext: string) => assetUrl(`logo/${v.file}-${n}.${ext}`);
  const set = (ext: string) => `${src(v.widths[0], ext)} 1x, ${src(v.widths[1], ext)} 2x`;
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={set('webp')} />
      <img
        src={src(v.widths[0], 'png')}
        srcSet={set('png')}
        alt={alt}
        width={v.w}
        height={v.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}
