import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footerText: {
    position: 'absolute',
    bottom: theme.spacing(6),
    left: theme.spacing(6),
    transition: 'all 0.5s ease',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(3),
      left: theme.spacing(3),
    },
  },
}));

export const FooterText = () => {
  const classes = useStyles();
  return (
    <Typography variant="body2" component="p" className={classes.footerText}>
      © {new Date().getFullYear()} Baoxiang Xu
    </Typography>
  );
};
