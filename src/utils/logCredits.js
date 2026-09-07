import { primary } from '../components/theme/Themes';

export const logCredits = () => {
  const wave = String.fromCodePoint(0x1f44b);

  const logStyle = [
    `color: ${primary}`,
    'font-size: 2em',
    'font-weight: 300',
    'padding: 60px 0px 60px 0px',
  ].join(';');

  console.log(
    `%c Baoxiang Xu — baoxiangxu.github.io ${wave}`,
    logStyle
  );
  console.log(
    'Source: https://github.com/baoxiangxu/baoxiangxu.github.io · ' +
      'Template by github.com/JoHoop'
  );
};
