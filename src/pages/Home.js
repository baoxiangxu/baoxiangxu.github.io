import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import DisplacementSphere from '../components/background/DisplacementSphere';
import { ViewControls } from '../components/controls/ViewControls';
import { LogoLink } from '../components/logo/LogoLink';
import { Content } from '../components/content/Content';
import { FooterText } from '../components/footer/FooterText';
import { AcademicContent } from '../components/content/AcademicContent';
import { SocialIcons } from '../components/content/SocialIcons';
import { SpeedDials } from '../components/speedDial/SpeedDial';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
  },
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    animation: '$bounce 2s infinite',
    color: theme.palette.text.secondary,
    zIndex: 10,
    background: 'none',
    border: 'none',
    font: 'inherit',
    padding: theme.spacing(1),
    borderRadius: 8,
    // fade out as the reader scrolls into the content below
    transition: 'opacity 0.4s ease, visibility 0.4s ease',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  scrollIndicatorHidden: {
    opacity: 0,
    visibility: 'hidden',
  },
  scrollText: {
    fontSize: '0.85rem',
    marginBottom: 8,
    opacity: 0.7,
    letterSpacing: '0.02em',
  },
  scrollIcon: {
    fontSize: '1.5rem',
  },
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': { transform: 'translateX(-50%) translateY(0)' },
    '40%': { transform: 'translateX(-50%) translateY(-10px)' },
    '60%': { transform: 'translateX(-50%) translateY(-5px)' },
  },
  academicSection: {
    minHeight: '100vh',
    position: 'relative',
  },
}));

export const Home = () => {
  const classes = useStyles();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToContent = () => {
    const academicSection = document.getElementById('academic-section');
    if (academicSection) academicSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={classes.root}>
      <DisplacementSphere />
      <ViewControls />

      {/* Hero */}
      <div className={classes.heroSection}>
        <LogoLink />
        <Content />
        <Hidden smDown>
          <SocialIcons />
        </Hidden>
        <Hidden mdUp>
          <SpeedDials />
        </Hidden>
        <FooterText />

        <button
          type="button"
          className={`${classes.scrollIndicator} ${
            scrolled ? classes.scrollIndicatorHidden : ''
          }`}
          onClick={scrollToContent}
          aria-label="Scroll to research and academic profile"
          tabIndex={scrolled ? -1 : 0}
        >
          <span className={classes.scrollText}>Scroll to explore</span>
          <i className={`fas fa-chevron-down ${classes.scrollIcon}`} aria-hidden="true" />
        </button>
      </div>

      {/* Academic profile */}
      <div id="academic-section" className={classes.academicSection}>
        <AcademicContent />
      </div>
    </div>
  );
};
