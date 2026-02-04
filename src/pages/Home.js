import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import DisplacementSphere from '../components/background/DisplacementSphere';
import { ThemeToggle } from '../components/theme/ThemeToggle';
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
  },
  scrollText: {
    fontSize: '0.85rem',
    marginBottom: 8,
    opacity: 0.7,
  },
  scrollIcon: {
    fontSize: '1.5rem',
  },
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateX(-50%) translateY(0)',
    },
    '40%': {
      transform: 'translateX(-50%) translateY(-10px)',
    },
    '60%': {
      transform: 'translateX(-50%) translateY(-5px)',
    },
  },
  academicSection: {
    minHeight: '100vh',
    position: 'relative',
  },
}));

export const Home = () => {
  const classes = useStyles();

  const scrollToContent = () => {
    const academicSection = document.getElementById('academic-section');
    if (academicSection) {
      academicSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={classes.root}>
        <DisplacementSphere />
        
        {/* Hero Section - 原来的首页 */}
        <div className={classes.heroSection}>
          <LogoLink />
          <Content />
          <ThemeToggle />
          <Hidden smDown>
            <SocialIcons />
          </Hidden>
          <Hidden mdUp>
            <SpeedDials />
          </Hidden>
          <FooterText />
          
          {/* 下滑提示 */}
          <div className={classes.scrollIndicator} onClick={scrollToContent}>
            <span className={classes.scrollText}>Scroll to explore</span>
            <i className={`fas fa-chevron-down ${classes.scrollIcon}`}></i>
          </div>
        </div>

        {/* Academic Section - 学术内容 */}
        <div id="academic-section" className={classes.academicSection}>
          <AcademicContent />
        </div>
      </div>
    </>
  );
};
