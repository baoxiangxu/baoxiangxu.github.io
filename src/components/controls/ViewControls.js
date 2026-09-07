import React, { useContext, useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  Zoom,
  Paper,
  Slider,
  Typography,
  ClickAwayListener,
  Grow,
} from '@material-ui/core';
import { Brightness4, Brightness7, Tune } from '@material-ui/icons';

import { ThemeContext } from '../theme/ThemeProvider';
import { useBackdropVisibility, DEFAULT_VISIBILITY } from './BackdropVisibility';

const useStyles = makeStyles((theme) => ({
  // Fixed, not absolute: these stay reachable while reading, which the old
  // hero-only theme toggle did not.
  dock: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(2),
      bottom: theme.spacing(2),
    },
  },
  button: {
    height: '2.5rem',
    width: '2.5rem',
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(45, 55, 72, 0.92)' : 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(8px)',
  },
  icon: { fontSize: '1.25rem' },
  panel: {
    width: 268,
    padding: theme.spacing(2.5, 2.5, 2),
    borderRadius: 12,
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(45, 55, 72, 0.97)' : 'rgba(255, 255, 255, 0.97)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
  },
  panelTitle: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  panelHint: {
    fontSize: '0.8125rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
    marginBottom: theme.spacing(1.5),
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  edgeLabel: {
    fontSize: '0.6875rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  value: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: theme.spacing(0.5),
  },
  reset: {
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    fontSize: '0.75rem',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  },
  percent: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
  },
}));

export const ViewControls = () => {
  const classes = useStyles();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { visibility, setVisibility, reset } = useBackdropVisibility();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const percent = Math.round(visibility * 100);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={classes.dock}>
        <Grow in={open} unmountOnExit>
          <Paper ref={panelRef} className={classes.panel} elevation={0}>
            <Typography component="p" className={classes.panelTitle}>
              Background
            </Typography>
            <Typography component="p" className={classes.panelHint}>
              How much of the animated backdrop shows through behind the text.
            </Typography>
            <div className={classes.sliderRow}>
              <span className={classes.edgeLabel}>Hidden</span>
              <Slider
                value={percent}
                min={0}
                max={100}
                step={1}
                onChange={(e, v) => setVisibility(v / 100)}
                aria-label="Background visibility"
                aria-valuetext={`${percent} percent`}
              />
              <span className={classes.edgeLabel}>Full</span>
            </div>
            <div className={classes.value}>
              <button type="button" className={classes.reset} onClick={reset}>
                Reset to {Math.round(DEFAULT_VISIBILITY * 100)}%
              </button>
              <span className={classes.percent}>{percent}%</span>
            </div>
          </Paper>
        </Grow>

        <Tooltip title="Background settings" placement="left" TransitionComponent={Zoom}>
          <IconButton
            color="inherit"
            className={classes.button}
            onClick={() => setOpen((v) => !v)}
            aria-label="Background settings"
            aria-expanded={open}
          >
            <Tune className={classes.icon} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Toggle theme" placement="left" TransitionComponent={Zoom}>
          <IconButton
            color="inherit"
            className={classes.button}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Brightness4 className={classes.icon} />
            ) : (
              <Brightness7 className={classes.icon} />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default ViewControls;
