import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import Theme from '../../content/theme.json';

export const primary = Theme.primary;
export const secondary = Theme.secondary;
export const black = Theme.black;
export const white = Theme.white;

/**
 * Three families, one job each — every size and weight in the site is built
 * from these, so nothing picks a font of its own.
 *
 *   serif : section headings and the name. Carries the academic tone.
 *   sans  : everything you read or click — body copy, nav, cards, labels.
 *   mono  : the hero only. Fixed-width keeps the decrypt animation from
 *           jittering, and it reads as a deliberate motif rather than a
 *           fourth random typeface.
 */
export const serifFamily = "'Libre Baskerville', Georgia, 'Times New Roman', serif";
export const sansFamily =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const monoFamily =
  "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const typography = {
  fontFamily: sansFamily,
  fontSize: 16,
  htmlFontSize: 16,
  // h1/h2/h5 are used by the hero only.
  h1: { fontFamily: monoFamily, fontWeight: 500 },
  h2: { fontFamily: monoFamily, fontWeight: 500, letterSpacing: '-0.02em' },
  h5: { fontFamily: monoFamily, fontWeight: 400 },
  h6: { fontFamily: sansFamily, fontWeight: 600 },
  body1: { fontFamily: sansFamily, fontWeight: 400, lineHeight: 1.7 },
  body2: { fontFamily: sansFamily, fontWeight: 400 },
  button: { fontFamily: sansFamily, fontWeight: 500, textTransform: 'none' },
};

export const LightTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      background: {
        default: white,
      },
      foreground: {
        default: black,
      },
    },
    typography,
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            color: black,
            backgroundColor: white,
          },
        },
      },
      MuiIconButton: {
        root: {
          boxShadow:
            '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
          '&:hover': {
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease',
        },
      },
      MuiFab: {
        root: {
          width: '2.5rem',
          height: '2.5rem',
          fontSize: '1.25rem',
        },
        primary: {
          color: black,
          backgroundColor: 'transparent',
          '&:hover': {
            color: black,
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease !important',
        },
      },
      MuiSpeedDialAction: {
        fab: {
          color: white,
          backgroundColor: 'transparent',
          '&:hover': {
            color: white,
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease',
          margin: '0px',
          marginBottom: '16px',
        },
      },
      MuiTooltip: {
        tooltip: {
          fontFamily: monoFamily,
          backgroundColor: primary,
          color: black,
          fontSize: 11,
        },
      },
    },
  })
);

export const DarkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      background: {
        default: black,
      },
      foreground: {
        default: white,
      },
    },
    typography,
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            color: white,
            backgroundColor: black,
          },
        },
      },
      MuiIconButton: {
        root: {
          boxShadow:
            '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
          '&:hover': {
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease',
        },
      },
      MuiFab: {
        root: {
          width: '2.5rem',
          height: '2.5rem',
          fontSize: '1.25rem',
        },
        primary: {
          color: white,
          backgroundColor: 'transparent',
          '&:hover': {
            color: white,
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease !important',
        },
      },
      MuiSpeedDialAction: {
        fab: {
          color: white,
          backgroundColor: 'transparent',
          '&:hover': {
            color: white,
            backgroundColor: primary,
          },
          transition: 'all 0.5s ease',
          margin: '0px',
          marginBottom: '16px',
        },
      },
      MuiTooltip: {
        tooltip: {
          fontFamily: monoFamily,
          backgroundColor: primary,
          color: white,
          fontSize: 11,
        },
      },
    },
  })
);
