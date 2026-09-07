import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Initials } from '../../utils/getName';

const useStyles = makeStyles((theme) => ({
  svgHover: {
    fill: theme.palette.foreground.default,
    stroke: theme.palette.foreground.default,
    transition: 'fill 0.5s ease, stroke 0.5s ease',
    '&:hover': {
      fill: theme.palette.primary.main,
      stroke: theme.palette.primary.main,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  ring: {
    fill: 'none',
  },
  initials: {
    stroke: 'none',
    fontFamily: "'Inter', 'Poppins', Helvetica, Arial, sans-serif",
    fontWeight: 700,
    fontSize: '150px',
    letterSpacing: '-6px',
  },
}));

export const Logo = () => {
  const classes = useStyles();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      className={classes.svgHover}
      role="img"
      aria-label={`${Initials} monogram`}
    >
      <circle className={classes.ring} cx="200" cy="200" r="180" strokeWidth="22" />
      <text
        className={classes.initials}
        x="200"
        y="200"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {Initials}
      </text>
    </svg>
  );
};
