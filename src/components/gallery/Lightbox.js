import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import { SIDEBAR_WIDTH } from '../content/layout';

const useStyles = makeStyles((theme) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    // Stop short of the sidebar so the section nav stays visible and usable
    // while a photo is open. On stacked (narrow) layouts there is no sidebar
    // beside the content, so the viewer takes the full screen.
    left: 0,
    [theme.breakpoints.up('md')]: {
      left: SIDEBAR_WIDTH,
    },
    zIndex: 2000,
    backgroundColor: 'rgba(10, 12, 16, 0.94)',
    backdropFilter: 'blur(6px)',
    overscrollBehavior: 'contain',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: '$fadeIn 0.2s ease',
  },
  '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
  figure: {
    margin: 0,
    maxWidth: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    maxWidth: 'min(92%, 1200px)',
    maxHeight: '84vh',
    objectFit: 'contain',
    borderRadius: 6,
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  },
  caption: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.8rem',
    marginTop: theme.spacing(1.5),
    letterSpacing: '0.04em',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    [theme.breakpoints.down('xs')]: { width: 40, height: 40 },
  },
  prev: { left: 'max(12px, 2vw)' },
  next: { right: 'max(12px, 2vw)' },
  close: {
    position: 'absolute',
    top: 'max(12px, 2vh)',
    right: 'max(12px, 2vw)',
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
  },
}));

/**
 * Full-screen photo viewer. Loads the high-resolution version only once a
 * photo is actually opened, so the grid stays lightweight.
 */
export const Lightbox = ({ photos, index, onClose, onNavigate }) => {
  const classes = useStyles();
  const open = index !== null && index >= 0;

  const goPrev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      onNavigate((index - 1 + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  const goNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      onNavigate((index + 1) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // NOTE: deliberately no `body { overflow: hidden }` scroll lock. Locking
    // the body kills `position: sticky`, which made the whole sidebar jump out
    // of view the moment a photo was opened.
  }, [open, onClose, goPrev, goNext]);

  if (!open) return null;
  const photo = photos[index];

  // A card up the tree sets `backdrop-filter`, which makes it the containing
  // block for `position: fixed` children — the overlay was being sized and
  // placed against that card instead of the viewport. Portal past it.
  const overlay = (
    <div
      className={classes.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
    >
      <button className={classes.close} onClick={onClose} aria-label="Close">
        <i className="fas fa-xmark" />
      </button>
      {photos.length > 1 && (
        <button
          className={`${classes.navButton} ${classes.prev}`}
          onClick={goPrev}
          aria-label="Previous photo"
        >
          <i className="fas fa-chevron-left" />
        </button>
      )}
      <figure className={classes.figure} onClick={(e) => e.stopPropagation()}>
        <img className={classes.image} src={photo.large} alt={photo.alt} />
        <figcaption className={classes.caption}>
          {index + 1} / {photos.length}
        </figcaption>
      </figure>
      {photos.length > 1 && (
        <button
          className={`${classes.navButton} ${classes.next}`}
          onClick={goNext}
          aria-label="Next photo"
        >
          <i className="fas fa-chevron-right" />
        </button>
      )}
    </div>
  );

  return typeof document === 'undefined'
    ? overlay
    : ReactDOM.createPortal(overlay, document.body);
};

export default Lightbox;
