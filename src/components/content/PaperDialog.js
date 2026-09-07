import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { serifFamily, sansFamily } from '../theme/Themes';

const useStyles = makeStyles((theme) => ({
  scrim: {
    position: 'fixed',
    inset: 0,
    zIndex: 2100,
    backgroundColor: 'rgba(15, 20, 28, 0.55)',
    backdropFilter: 'blur(3px)',
    overflowY: 'auto',
    padding: theme.spacing(6, 3),
    animation: '$fade 0.18s ease',
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(3, 1.5) },
  },
  '@keyframes fade': { from: { opacity: 0 }, to: { opacity: 1 } },
  panel: {
    position: 'relative',
    margin: '0 auto',
    maxWidth: 820,
    borderRadius: 16,
    padding: theme.spacing(5, 6, 5),
    backgroundColor: theme.palette.type === 'dark' ? '#1f2836' : '#ffffff',
    boxShadow: '0 24px 60px rgba(0,0,0,0.32)',
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(4, 2.5) },
  },
  close: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  title: {
    fontFamily: serifFamily,
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.3,
    paddingRight: theme.spacing(5),
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  meta: {
    fontFamily: sansFamily,
    fontSize: '0.9375rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  journal: { fontStyle: 'italic', fontWeight: 600, color: theme.palette.text.primary },
  abstract: {
    fontFamily: sansFamily,
    fontSize: '1.0625rem',
    lineHeight: 1.8,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
  },
  missing: {
    fontFamily: sansFamily,
    fontSize: '1rem',
    lineHeight: 1.7,
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing(4),
  },
  action: {
    fontFamily: sansFamily,
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    padding: theme.spacing(1.25, 3),
    borderRadius: 8,
    marginBottom: theme.spacing(4),
  },
  figure: {
    margin: 0,
    borderRadius: 12,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.type === 'dark' ? '#3d4859' : '#e2e8f0'}`,
    backgroundColor: '#fff',
    '& img': { width: '100%', display: 'block' },
  },
}));

export const PaperDialog = ({ paper, onClose }) => {
  const classes = useStyles();

  useEffect(() => {
    if (!paper) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paper, onClose]);

  if (!paper) return null;

  const dialog = (
    <div
      className={classes.scrim}
      role="dialog"
      aria-modal="true"
      aria-label={paper.title}
      onClick={onClose}
    >
      <div className={classes.panel} onClick={(e) => e.stopPropagation()}>
        <IconButton className={classes.close} onClick={onClose} aria-label="Close" size="small">
          <Close />
        </IconButton>

        <Typography component="h2" className={classes.title}>
          {paper.title}
        </Typography>
        <Typography component="p" className={classes.meta}>
          {paper.coauthors} · <span className={classes.journal}>{paper.journal}</span>, {paper.year}
        </Typography>

        {paper.abstract ? (
          <Typography component="p" className={classes.abstract}>
            {paper.abstract}
          </Typography>
        ) : (
          <Typography component="p" className={classes.missing}>
            Abstract coming soon — see the published version for the full text.
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.action}
          disableElevation
        >
          View Paper
        </Button>

        <figure className={classes.figure}>
          <img
            src={`/images/figures/${paper.image}.webp`}
            alt={paper.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </div>
  );

  return typeof document === 'undefined'
    ? dialog
    : ReactDOM.createPortal(dialog, document.body);
};

export default PaperDialog;
