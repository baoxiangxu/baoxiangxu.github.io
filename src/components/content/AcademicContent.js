import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Typography, IconButton, Link, Tooltip, Zoom, Collapse } from '@material-ui/core';
import { Menu as MenuIcon, Close as CloseIcon } from '@material-ui/icons';
import Profile from '../../content/profile.json';
import Education from '../../content/education.json';
import Projects from '../../content/projects.json';
import Galleries from '../../content/galleries.json';
import { PhotoGrid } from '../gallery/PhotoGrid';
import { PaperDialog } from './PaperDialog';
import Publications from '../../content/publications.json';
import { serifFamily, sansFamily } from '../theme/Themes';
import { useBackdropVisibility } from '../controls/BackdropVisibility';
import { SIDEBAR_WIDTH } from './layout';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    // The wash over the fixed sphere canvas is applied inline, because the
    // reader can change how much of it shows through (see ViewControls).
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    padding: theme.spacing(14, 3, 3),
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 100,
    borderRight: `1px solid ${theme.palette.type === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
    flexShrink: 0,
    backgroundColor: 'transparent',
    // Phones: the whole column collapses into a slim sticky bar. Stacked, it
    // used to run 585px — 69% of an iPhone screen — before any content.
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
      padding: 0,
      overflow: 'visible',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      borderRight: 'none',
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'}`,
      // Opaque on purpose: nesting backdrop-filter on both the bar and the
      // dropdown made the panel composite as translucent in Chromium, so the
      // article showed through the menu.
      backgroundColor: theme.palette.type === 'dark' ? '#1f2836' : '#ffffff',
      display: 'block',
      textAlign: 'left',
    },
  },
  // The slim bar: identity on the left, menu toggle on the right.
  mobileBar: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(1.5),
      padding: theme.spacing(1, 1.5, 1, 2),
      minHeight: 60,
    },
  },
  mobileIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    minWidth: 0,
  },
  mobileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    border: `1px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    '& img': { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  },
  mobileName: {
    fontFamily: serifFamily,
    fontWeight: 700,
    fontSize: '1.0625rem',
    lineHeight: 1.2,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mobileRole: {
    fontFamily: sansFamily,
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.2,
  },
  menuButton: {
    flexShrink: 0,
    color: theme.palette.text.primary,
  },
  // Everything that lives in the column on desktop; a dropdown panel on phones.
  // MUI Collapse would keep the desktop column hidden, so neutralise it there
  // and let it do its job only on phones.
  collapseWrap: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      height: 'auto !important',
      visibility: 'visible !important',
      overflow: 'visible !important',
      minHeight: 0,
      display: 'flex',
      flex: 1,
      '& > div': { width: '100%', display: 'flex' },
    },
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
    },
  },
  sidebarBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      maxHeight: '70vh',
      overflowY: 'auto',
      padding: theme.spacing(2, 2, 3),
      backgroundColor: theme.palette.type === 'dark' ? '#1f2836' : '#ffffff',
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'}`,
      boxShadow: '0 14px 28px rgba(0,0,0,0.16)',
    },
  },
  avatar: {
    width: 150,
    height: 150,
    [theme.breakpoints.down('sm')]: { display: 'none' },
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    overflow: 'hidden',
    border: `3px solid ${theme.palette.type === 'dark' ? '#2d3748' : '#fff'}`,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
  },
  sidebarName: {
    [theme.breakpoints.down('sm')]: { display: 'none' },
    fontFamily: serifFamily,
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.25,
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  sidebarRole: {
    [theme.breakpoints.down('sm')]: { display: 'none' },
    fontFamily: sansFamily,
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),
  },
  navWrap: {
    width: '100%',
    marginTop: theme.spacing(2.5),
  },
  nav: {
    listStyle: 'none',
    margin: 0,
    width: '100%',
    padding: 0,
  },
  navItem: {
    marginBottom: theme.spacing(0.75),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0.25),
    },
  },
  navLink: {
    // `font: inherit` has to come first — as a shorthand it resets family,
    // size and weight, so anything declared before it is thrown away.
    font: 'inherit',
    background: 'none',
    border: 'none',
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(1.25, 2),
    borderRadius: 10,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    fontFamily: sansFamily,
    fontSize: '1.125rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    color: theme.palette.text.secondary,
    transition: 'background-color 0.25s ease, color 0.25s ease',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
      padding: theme.spacing(1.5, 2),
      fontSize: '1.0625rem',
    },
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? 'rgba(99,179,237,0.14)' : '#eef6fb',
      color: theme.palette.text.primary,
    },
    '&.active': {
      backgroundColor: theme.palette.type === 'dark' ? '#2c5282' : '#e3f4f4',
      color: theme.palette.type === 'dark' ? '#9decec' : '#00706f',
      fontWeight: 600,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
      paddingTop: theme.spacing(2),
      borderTop: `1px solid ${theme.palette.type === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.08)'}`,
    },
  },
  icons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1.25),
    listStyle: 'none',
    flexWrap: 'wrap',
    padding: 0,
    margin: 0,
  },
  iconLink: {
    color: theme.palette.text.secondary,
    fontSize: '1.375rem',
    width: '2.75rem',
    height: '2.75rem',
    transition: 'color 0.25s ease, background-color 0.25s ease',
    '&:hover': {
      color: theme.palette.type === 'dark' ? '#0b1220' : '#ffffff',
    },
  },
  backToTop: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1, 2.5),
    borderRadius: 6,
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(99, 179, 237, 0.2)' : 'rgba(49, 130, 206, 0.1)',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    cursor: 'pointer',
    fontFamily: sansFamily,
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
    // Stacked layout puts the sidebar at the top of the content, where a
    // "back to top" button has nothing to do.
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  main: {
    flex: '1 1 auto',
    maxWidth: 1520,
    minWidth: 0,
    // Right padding clears the floating control dock so the buttons never
    // sit on top of a card.
    padding: theme.spacing(14, 13, 10, 6),
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto',
      width: '100%',
      maxWidth: '100%',
      padding: theme.spacing(3, 2, 4),
    },
  },
  section: {
    marginBottom: theme.spacing(7),
    scrollMarginTop: theme.spacing(2),
  },
  sectionTitle: {
    fontFamily: serifFamily,
    fontWeight: 700,
    fontSize: '2.125rem',
    lineHeight: 1.25,
    marginBottom: theme.spacing(2.5),
    color: theme.palette.text.primary,
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(0.5),
    display: 'inline-block',
  },
  subTitle: {
    fontFamily: serifFamily,
    fontWeight: 700,
    fontSize: '1.375rem',
    lineHeight: 1.4,
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.text.primary,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(1.5),
  },
  card: {
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(2.5),
    borderRadius: 12,
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    backdropFilter: 'blur(5px)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
      alignItems: 'flex-start',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
    },
  },
  plainCard: {
    display: 'block',
    '&:hover': { transform: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  },
  cardContent: { flex: 1, minWidth: 0 },
  cardImage: {
    // Sized two ways on purpose: `flex` applies when this is a direct child of
    // the card (the project card), `width` applies when it sits inside the
    // clickable wrapper (the publication cards), where flex-basis is ignored.
    flex: '0 0 208px',
    width: 208,
    maxWidth: '100%',
    height: 132,
    borderRadius: 8,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      maxWidth: '100%',
      // Full width on a phone, so show the whole diagram rather than a
      // cover-cropped band of it.
      height: 'auto',
      flex: 'none',
      '& img': { height: 'auto', objectFit: 'contain' },
    },
  },
  paperTitle: {
    fontFamily: sansFamily,
    // #00bfbf on white is only ~2.2:1 — too faint for a link that carries the
    // whole card. Darken it in light mode; the bright teal already reads on
    // the dark background.
    color: theme.palette.type === 'dark' ? theme.palette.primary.main : '#00706f',
    fontWeight: 700,
    fontSize: '1.125rem',
    lineHeight: 1.45,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  paperTitleButton: {
    font: 'inherit',
    background: 'none',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
    display: 'block',
    fontFamily: sansFamily,
    color: theme.palette.type === 'dark' ? theme.palette.primary.main : '#00706f',
    fontWeight: 700,
    fontSize: '1.125rem',
    lineHeight: 1.45,
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.0625rem',
      lineHeight: 1.4,
    },
    '&:hover': { textDecoration: 'underline' },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 3,
      borderRadius: 4,
    },
  },
  paperLinkButton: {
    font: 'inherit',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    fontFamily: sansFamily,
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    '&:hover': { color: theme.palette.primary.main },
  },
  cardImageButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'zoom-in',
    flex: '0 0 auto',
    [theme.breakpoints.down('xs')]: {
      flex: '1 1 auto',
      width: '100%',
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 3,
      borderRadius: 10,
    },
  },
  paperLink: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    textDecoration: 'none',
    fontFamily: sansFamily,
    fontSize: '0.9375rem',
    '&:hover': { color: theme.palette.primary.main },
  },
  projectBlurb: {
    fontFamily: sansFamily,
    fontSize: '1.0625rem',
    lineHeight: 1.7,
    color: theme.palette.text.primary,
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(0.5)}px`,
  },
  paperMeta: {
    fontFamily: sansFamily,
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
  },
  journalName: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  tagsContainer: {
    display: 'flex',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    flexWrap: 'wrap',
  },
  tag: {
    fontFamily: sansFamily,
    fontSize: '0.6875rem',
    fontWeight: 600,
    padding: '3px 7px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid',
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(0.5),
    marginBottom: theme.spacing(2.5),
    borderLeft: `2px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -6,
      top: 0,
      width: 10,
      height: 10,
      background: theme.palette.primary.main,
      borderRadius: '50%',
      border: `2px solid ${theme.palette.background.paper}`,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
  },
  timelineTitle: {
    fontFamily: sansFamily,
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.75),
    fontSize: '1.1875rem',
  },
  timelineText: {
    fontFamily: sansFamily,
    fontSize: '1.0625rem',
    lineHeight: 1.65,
    color: theme.palette.text.secondary,
    margin: 0,
  },
  aboutText: {
    marginBottom: theme.spacing(1.5),
    fontFamily: sansFamily,
    fontSize: '1.0625rem',
    color: theme.palette.text.primary,
    lineHeight: 1.8,
  },
  galleryIntro: {
    fontFamily: sansFamily,
    fontSize: '1.0625rem',
    color: theme.palette.text.primary,
    fontWeight: 700,
  },
  controlSlot: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

// Every tag used below has an entry here, so no tag silently falls back.
const tagColors = {
  policy: { color: '#fc8181', border: 'rgba(252, 129, 129, 0.35)', bg: 'rgba(252, 129, 129, 0.07)' },
  environment: { color: '#68d391', border: 'rgba(104, 211, 145, 0.35)', bg: 'rgba(104, 211, 145, 0.07)' },
  'public-services': { color: '#63b3ed', border: 'rgba(99, 179, 237, 0.35)', bg: 'rgba(99, 179, 237, 0.07)' },
  development: { color: '#f6ad55', border: 'rgba(246, 173, 85, 0.35)', bg: 'rgba(246, 173, 85, 0.07)' },
  entrepreneurship: { color: '#9f7aea', border: 'rgba(159, 122, 234, 0.35)', bg: 'rgba(159, 122, 234, 0.07)' },
  land: { color: '#d69e2e', border: 'rgba(214, 158, 46, 0.35)', bg: 'rgba(214, 158, 46, 0.07)' },
  python: { color: '#4fd1c5', border: 'rgba(79, 209, 197, 0.35)', bg: 'rgba(79, 209, 197, 0.07)' },
  tutorial: { color: '#81e6d9', border: 'rgba(129, 230, 217, 0.35)', bg: 'rgba(129, 230, 217, 0.07)' },
  education: { color: '#4fd1c5', border: 'rgba(79, 209, 197, 0.35)', bg: 'rgba(79, 209, 197, 0.07)' },
  'market-design': { color: '#63b3ed', border: 'rgba(99, 179, 237, 0.35)', bg: 'rgba(99, 179, 237, 0.07)' },
  structural: { color: '#d6bcfa', border: 'rgba(214, 188, 250, 0.35)', bg: 'rgba(214, 188, 250, 0.07)' },
  surveys: { color: '#81e6d9', border: 'rgba(129, 230, 217, 0.35)', bg: 'rgba(129, 230, 217, 0.07)' },
  info: { color: '#63b3ed', border: 'rgba(99, 179, 237, 0.35)', bg: 'rgba(99, 179, 237, 0.07)' },
  labor: { color: '#f6ad55', border: 'rgba(246, 173, 85, 0.35)', bg: 'rgba(246, 173, 85, 0.07)' },
  theory: { color: '#9f7aea', border: 'rgba(159, 122, 234, 0.35)', bg: 'rgba(159, 122, 234, 0.07)' },
  data: { color: '#f6e05e', border: 'rgba(246, 224, 94, 0.35)', bg: 'rgba(246, 224, 94, 0.07)' },
};

const Tag = ({ type, label }) => {
  const classes = useStyles();
  const colors = tagColors[type] || tagColors.data;
  return (
    <span
      className={classes.tag}
      style={{ color: colors.color, borderColor: colors.border, backgroundColor: colors.bg }}
    >
      {label}
    </span>
  );
};

// Card thumbnail: pre-sized copy with the original as the fallback.
const CardImage = ({ stem, alt }) => {
  const classes = useStyles();
  return (
    <div className={classes.cardImage}>
      <img
        src={`/images/cards/${stem}.webp`}
        alt={alt}
        loading="lazy"
        decoding="async"
        width="520"
        height="340"
      />
    </div>
  );
};

// Section order and labels come from the content files, so adding or renaming
// a section is a data change, not a code change.
const SECTIONS = [
  { id: 'about', label: Profile.about.heading },
  { id: 'education', label: Education.heading },
  { id: 'research', label: Publications.heading },
  { id: 'code', label: 'Projects' },
  { id: 'life', label: 'Life' },
];

export const AcademicContent = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));
  const { visibility } = useBackdropVisibility();
  const [activeSection, setActiveSection] = useState('about');
  const [openPaper, setOpenPaper] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // veil = how much surface is painted over the sphere. The first 200px stay
  // fully transparent so the article joins the hero without a seam.
  const veil = 1 - visibility;
  const base = theme.palette.type === 'dark' ? '26, 32, 44' : '247, 250, 252';
  const isDark = theme.palette.type === 'dark';
  const panel = isDark ? '38, 46, 60' : '255, 255, 255';
  const panelAlpha = Math.min(1, veil + 0.1);
  const edge = isDark ? '0, 0, 0' : '15, 23, 42';

  const wash =
    `linear-gradient(to bottom, rgba(${base}, 0) 0px, rgba(${base}, ${veil}) 200px,` +
    ` rgba(${base}, ${veil}) 100%)`;

  // The sidebar panel and its shadow are painted as fixed-width background
  // bands. On a phone the sidebar is a top bar, not a left column, so those
  // bands would just cut a hard vertical seam down the page at 320px.
  const backdropStyle = {
    background: isNarrow
      ? wash
      : [
          `linear-gradient(to bottom, rgba(${panel}, 0) 0px, rgba(${panel}, ${panelAlpha}) 200px,` +
            ` rgba(${panel}, ${panelAlpha}) 100%) left top / ${SIDEBAR_WIDTH}px 100% no-repeat`,
          `linear-gradient(to bottom, rgba(${edge}, 0) 0px, rgba(${edge}, 0.07) 200px,` +
            ` rgba(${edge}, 0.07) 100%) ${SIDEBAR_WIDTH}px top / 18px 100% no-repeat`,
          wash,
        ].join(', '),
  };

  // Highlight whichever section the reader is actually looking at.
  //
  // Two earlier attempts were wrong. IntersectionObserver ranked by
  // intersection ratio, so a short section fully on screen lost to a tall one
  // only partly visible. A reading line a third of the way down then skipped
  // any section shorter than that offset. This uses a line just below the top
  // of the viewport and takes the last section to have crossed it, which is
  // stable for sections of any height.
  const suppressSpyUntil = useRef(0);

  useEffect(() => {
    const READING_LINE = 140; // px below the top of the viewport

    const update = () => {
      if (Date.now() < suppressSpyUntil.current) return;

      let current = SECTIONS[0].id;
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= READING_LINE) current = id;
      });

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = SECTIONS[SECTIONS.length - 1].id;

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    // Hold the clicked item highlighted while the smooth scroll runs, so the
    // nav doesn't flicker through every section on the way there.
    suppressSpyUntil.current = Date.now() + 900;
    setMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToHero = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const isExternal = (url) => /^https?:|\.pdf$/.test(url);

  return (
    <div className={classes.root} style={backdropStyle}>
      <aside className={classes.sidebar}>
        {/* Phones only: a 60px bar instead of a full-height column. */}
        <div className={classes.mobileBar}>
          <div className={classes.mobileIdentity}>
            <div className={classes.mobileAvatar}>
              <img src={`/images/${Profile.avatar}-360.webp`} alt={Profile.name} width="38" height="38" />
            </div>
            <div style={{ minWidth: 0 }}>
              <Typography component="p" className={classes.mobileName}>
                {Profile.name}
              </Typography>
              <Typography component="p" className={classes.mobileRole}>
                {Profile.mobileLine}
              </Typography>
            </div>
          </div>
          <IconButton
            className={classes.menuButton}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

        <Collapse in={menuOpen} timeout={220} className={classes.collapseWrap}>
          <div className={classes.sidebarBody}>
            <div className={classes.avatar}>
              <img src={`/images/${Profile.avatar}-360.webp`} alt={Profile.name} width="360" height="360" />
            </div>
            <Typography component="p" className={classes.sidebarName}>
              {Profile.name}
            </Typography>
            <Typography component="p" className={classes.sidebarRole}>
              {Profile.sidebarLines.map((line, i) => (
                <React.Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </Typography>

            <nav className={classes.navWrap} aria-label="Section navigation">
              <ul className={classes.nav}>
                {SECTIONS.map((section) => (
                  <li key={section.id} className={classes.navItem}>
                    <button
                      type="button"
                      className={`${classes.navLink} ${activeSection === section.id ? 'active' : ''}`}
                      aria-current={activeSection === section.id ? 'true' : undefined}
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
                <li className={classes.navItem}>
                  <a
                    href={Profile.cv.url}
                    className={classes.navLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {Profile.cv.label}
                  </a>
                </li>
              </ul>
            </nav>

            <footer className={classes.sidebarFooter}>
              <ul className={classes.icons}>
                {Profile.contacts.map((profile) => (
                  <li key={profile.network}>
                    <Tooltip title={profile.network} placement="top" TransitionComponent={Zoom}>
                      <IconButton
                        href={profile.url}
                        target={isExternal(profile.url) ? '_blank' : undefined}
                        rel={isExternal(profile.url) ? 'noopener noreferrer' : undefined}
                        className={classes.iconLink}
                        aria-label={profile.network}
                      >
                        <i className={profile.icon} />
                      </IconButton>
                    </Tooltip>
                  </li>
                ))}
              </ul>
              <button className={classes.backToTop} onClick={scrollToHero}>
                <i className="fas fa-arrow-up" style={{ marginRight: 6 }} />
                Back to Top
              </button>
            </footer>
          </div>
        </Collapse>
      </aside>

      {/* Main Content */}
      <main className={classes.main}>
        {/* About */}
        <section id="about" className={classes.section}>
          <Typography component="h2" className={classes.sectionTitle}>
            {Profile.about.heading}
          </Typography>
          {Profile.about.paragraphs.map((text) => (
            <Typography key={text.slice(0, 32)} className={classes.aboutText}>
              {text}
            </Typography>
          ))}
        </section>

        {/* Education */}
        <section id="education" className={classes.section}>
          <Typography component="h2" className={classes.sectionTitle}>
            {Education.heading}
          </Typography>
          {Education.items.map((item) => (
            <div className={classes.timelineItem} key={`${item.institution}-${item.period}`}>
              <Typography variant="h6" component="h3" className={classes.timelineTitle}>
                {item.institution}
              </Typography>
              <Typography component="p" className={classes.timelineText}>
                {item.period}
              </Typography>
              <Typography component="p" className={classes.timelineText}>
                {item.degree}
              </Typography>
            </div>
          ))}
        </section>

        {/* Research */}
        <section id="research" className={classes.section}>
          <Typography component="h2" className={classes.sectionTitle}>
            {Publications.heading}
          </Typography>
          <Typography component="h3" className={classes.subTitle}>
            {Publications.subheading}
          </Typography>

          {Publications.items.map((paper) => (
            <div className={classes.card} key={paper.id}>
              <div className={classes.cardContent}>
                <button
                  type="button"
                  className={classes.paperTitleButton}
                  onClick={() => setOpenPaper(paper)}
                >
                  {paper.title}
                </button>
                <Typography component="p" className={classes.paperMeta}>
                  {paper.coauthors}
                </Typography>
                <Typography component="p" className={classes.paperMeta}>
                  <span className={classes.journalName}>{paper.journal}</span>, {paper.year}
                  <button
                    type="button"
                    className={classes.paperLinkButton}
                    onClick={() => setOpenPaper(paper)}
                  >
                    [Abstract]
                  </button>
                  <Link
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.paperLink}
                  >
                    [Paper]
                  </Link>
                </Typography>
                <div className={classes.tagsContainer}>
                  {paper.tags.map((t) => (
                    <Tag key={t.type} type={t.type} label={t.label} />
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={classes.cardImageButton}
                onClick={() => setOpenPaper(paper)}
                aria-label={`Open details for ${paper.title}`}
              >
                <CardImage stem={paper.image} alt={paper.imageAlt} />
              </button>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section id="code" className={classes.section}>
          <Typography component="h2" className={classes.sectionTitle}>
            {Projects.heading}
          </Typography>
          {Projects.items.map((project) => (
            <div className={classes.card} key={project.id}>
              <div className={classes.cardContent}>
                <Link
                  href={project.url}
                  className={classes.paperTitle}
                  download={project.download || undefined}
                >
                  {project.title}
                </Link>
                <Typography component="p" className={classes.projectBlurb}>
                  {project.blurb}
                </Typography>
                <Typography component="p" className={classes.paperMeta}>
                  {project.meta}
                </Typography>
                <div className={classes.tagsContainer}>
                  {project.tags.map((t) => (
                    <Tag key={t.type} type={t.type} label={t.label} />
                  ))}
                </div>
              </div>
              <CardImage stem={project.image} alt={project.imageAlt} />
            </div>
          ))}
        </section>

        {/* Life */}
        <section id="life" className={classes.section}>
          <Typography component="h2" className={classes.sectionTitle}>
            {Galleries.heading}
          </Typography>
          {Galleries.galleries.map((gallery) => (
            <React.Fragment key={gallery.id}>
              <Typography component="h3" className={classes.subTitle}>
                {gallery.title}
              </Typography>
              <div className={`${classes.card} ${classes.plainCard}`}>
                <Typography component="p" className={classes.galleryIntro}>
                  {gallery.blurb}
                </Typography>
                <PhotoGrid gallery={gallery.id} photos={gallery.photos} label={gallery.title} />
              </div>
            </React.Fragment>
          ))}
        </section>
      </main>

      <PaperDialog paper={openPaper} onClose={() => setOpenPaper(null)} />
    </div>
  );
};

export default AcademicContent;
