import { Fragment } from 'react';

type Props = { text: string };

export function TextWithBreaks({ text }: Props) {
  return text.split('\n').map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}
