import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Lightbox } from './Lightbox';

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: theme.spacing(1.5),
    // On a phone the column is ~316px wide, so a 160px minimum lost the second
    // column by 4px and every photo rendered full-width.
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },
  tile: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    overflow: 'hidden',
    borderRadius: 8,
    cursor: 'zoom-in',
    padding: 0,
    border: 'none',
    backgroundColor: theme.palette.type === 'dark' ? '#2d3748' : '#edf2f7',
    display: 'block',
    '&:hover img, &:focus-visible img': { transform: 'scale(1.06)' },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    '& img': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      '& img': { transition: 'none' },
      '&:hover img': { transform: 'none' },
    },
  },
}));

/**
 * Photo grid backed by small pre-generated thumbnails.
 * The 2000px version is fetched only when a photo is opened.
 */
export const PhotoGrid = ({ gallery, photos, label }) => {
  const classes = useStyles();
  const [openIndex, setOpenIndex] = useState(null);

  const items = useMemo(
    () =>
      photos.map((name, i) => ({
        alt: `${label} photo ${i + 1}`,
        thumb: `/images/${gallery}/thumbs/${name}.webp`,
        large: `/images/${gallery}/large/${name}.webp`,
      })),
    [photos, gallery, label]
  );

  return (
    <>
      <div className={classes.grid}>
        {items.map((photo, i) => (
          <button
            key={photo.thumb}
            type="button"
            className={classes.tile}
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${photo.alt}`}
          >
            <img
              src={photo.thumb}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              width="640"
              height="640"
            />
          </button>
        ))}
      </div>
      <Lightbox
        photos={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
};

export default PhotoGrid;
