import { Fragment } from 'react';

/**
 * Título em linhas fixas (uma por linha, como na interface aprovada). O espaço entre
 * as linhas não aparece na tela, mas mantém as palavras separadas para leitores de
 * tela e para quem copia o texto.
 */
export function DisplayLines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && ' '}
      <span className="display__line">{line}</span>
    </Fragment>
  ));
}
