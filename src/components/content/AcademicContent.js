import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Link, Tooltip, Zoom } from '@material-ui/core';
import imageData from '../../settings/imageData.json';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
  },
  sidebar: {
    width: 260,
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    padding: theme.spacing(3),
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 100,
    borderRight: `1px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    backdropFilter: 'blur(10px)',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
      position: 'relative',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? '#4a5568' : '#e2e8f0'}`,
    },
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    overflow: 'hidden',
    border: `3px solid ${theme.palette.type === 'dark' ? '#2d3748' : '#fff'}`,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  sidebarName: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: '1.3rem',
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  nav: {
    listStyle: 'none',
    marginTop: theme.spacing(2),
    width: '100%',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing(1),
    },
  },
  navItem: {
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
  },
  navLink: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    fontWeight: 500,
    display: 'block',
    padding: theme.spacing(0.8, 1),
    borderRadius: 6,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    fontSize: '0.9rem',
    '&:hover, &.active': {
      backgroundColor: theme.palette.type === 'dark' ? '#2c5282' : '#ebf8ff',
      color: theme.palette.primary.main,
      transform: 'translateX(5px)',
    },
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
    width: '100%',
  },
  icons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
    listStyle: 'none',
    flexWrap: 'wrap',
    padding: 0,
  },
  iconLink: {
    color: theme.palette.text.secondary,
    fontSize: '1.1rem',
    transition: 'color 0.3s',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  backToTop: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0.8, 2),
    borderRadius: 6,
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(99, 179, 237, 0.2)' : 'rgba(49, 130, 206, 0.1)',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  },
  main: {
    flex: 1,
    padding: theme.spacing(4),
    maxWidth: 900,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: theme.spacing(2),
    },
  },
  section: {
    marginBottom: theme.spacing(5),
  },
  sectionTitle: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: '1.8rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(0.5),
    display: 'inline-block',
  },
  subTitle: {
    fontFamily: "'Libre Baskerville', serif",
    fontSize: '1.2rem',
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.text.primary,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(1.5),
  },
  card: {
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(2),
    borderRadius: 12,
    marginBottom: theme.spacing(1.5),
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
  },
  cardContent: {
    flex: 1,
  },
  cardImage: {
    flex: '0 0 130px',
    height: 85,
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
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: 100,
      flex: 'none',
    },
  },
  paperTitle: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  paperLink: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    textDecoration: 'none',
    fontSize: '0.9rem',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  journalName: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontStyle: 'italic',
  },
  tagsContainer: {
    display: 'flex',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: '0.55rem',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid',
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
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
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5),
    fontSize: '1rem',
  },
  timelineText: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    margin: 0,
  },
  aboutText: {
    marginBottom: theme.spacing(1.5),
    fontSize: '0.95rem',
    color: theme.palette.text.primary,
    lineHeight: 1.7,
  },
}));

// Tag colors
const tagColors = {
  education: { color: '#4fd1c5', border: 'rgba(79, 209, 197, 0.3)', bg: 'rgba(79, 209, 197, 0.05)' },
  'market-design': { color: '#63b3ed', border: 'rgba(99, 179, 237, 0.3)', bg: 'rgba(99, 179, 237, 0.05)' },
  structural: { color: '#d6bcfa', border: 'rgba(214, 188, 250, 0.3)', bg: 'rgba(214, 188, 250, 0.05)' },
  surveys: { color: '#81e6d9', border: 'rgba(129, 230, 217, 0.3)', bg: 'rgba(129, 230, 217, 0.05)' },
  info: { color: '#63b3ed', border: 'rgba(99, 179, 237, 0.3)', bg: 'rgba(99, 179, 237, 0.05)' },
  rct: { color: '#68d391', border: 'rgba(104, 211, 145, 0.3)', bg: 'rgba(104, 211, 145, 0.05)' },
  health: { color: '#f687b3', border: 'rgba(246, 135, 179, 0.3)', bg: 'rgba(246, 135, 179, 0.05)' },
  labor: { color: '#f6ad55', border: 'rgba(246, 173, 85, 0.3)', bg: 'rgba(246, 173, 85, 0.05)' },
  quasi: { color: '#f6ad55', border: 'rgba(246, 173, 85, 0.3)', bg: 'rgba(246, 173, 85, 0.05)' },
  policy: { color: '#fc8181', border: 'rgba(252, 129, 129, 0.3)', bg: 'rgba(252, 129, 129, 0.05)' },
  implementation: { color: '#a0aec0', border: 'rgba(160, 174, 192, 0.3)', bg: 'rgba(160, 174, 192, 0.05)' },
  theory: { color: '#9f7aea', border: 'rgba(159, 122, 234, 0.3)', bg: 'rgba(159, 122, 234, 0.05)' },
  evolution: { color: '#68d391', border: 'rgba(104, 211, 145, 0.3)', bg: 'rgba(104, 211, 145, 0.05)' },
  data: { color: '#f6e05e', border: 'rgba(246, 224, 94, 0.3)', bg: 'rgba(246, 224, 94, 0.05)' },
  ai: { color: '#f687b3', border: 'rgba(246, 135, 179, 0.3)', bg: 'rgba(246, 135, 179, 0.05)' },
};

const Tag = ({ type, label }) => {
  const classes = useStyles();
  const colors = tagColors[type] || tagColors.data;
  return (
    <span
      className={classes.tag}
      style={{
        color: colors.color,
        borderColor: colors.border,
        backgroundColor: colors.bg,
      }}
    >
      {label}
    </span>
  );
};

export const AcademicContent = () => {
  const classes = useStyles();
  const [activeSection, setActiveSection] = useState('about');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={classes.root}>
      {/* Sidebar */}
      <aside className={classes.sidebar}>
        <div className={classes.avatar}>
          <img src="/images/avatar.jpg" alt="Tomas Larroucau" />
        </div>
        <Typography className={classes.sidebarName}>Baoxiang Xu</Typography>
        <nav>
          <ul className={classes.nav}>
            {['about', 'research', 'code', 'life', 'education'].map((section) => (
              <li key={section} className={classes.navItem}>
                <span
                  className={`${classes.navLink} ${activeSection === section ? 'active' : ''}`}
                  onClick={() => scrollToSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </li>
            ))}
            <li className={classes.navItem}>
              <a href="/resume.pdf" className={classes.navLink} target="_blank" rel="noopener noreferrer">
                CV
              </a>
            </li>
          </ul>
        </nav>
        <footer className={classes.sidebarFooter}>
          <ul className={classes.icons}>
            <li>
              <Tooltip title="Email" TransitionComponent={Zoom}>
                <IconButton href="mailto:baoxiang@asu.edu" className={classes.iconLink} size="small">
                  <i className="fas fa-envelope"></i>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="LinkedIn" TransitionComponent={Zoom}>
                <IconButton href="https://www.linkedin.com/in/baoxiang-xu-32442637b/" target="_blank" className={classes.iconLink} size="small">
                  <i className="fab fa-linkedin-in"></i>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="GitHub" TransitionComponent={Zoom}>
                <IconButton href="https://github.com/baoxiangxu" target="_blank" className={classes.iconLink} size="small">
                  <i className="fab fa-github"></i>
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Phone" TransitionComponent={Zoom}>
                <IconButton href="tel:+14806122350" className={classes.iconLink} size="small">
                  <i className="fas fa-phone"></i>
                </IconButton>
              </Tooltip>
            </li>
          </ul>
          <button className={classes.backToTop} onClick={scrollToHero}>
            <i className="fas fa-arrow-up" style={{ marginRight: 6 }}></i>
            Back to Top
          </button>
        </footer>
      </aside>

      {/* Main Content */}
      <main className={classes.main}>
        {/* About Section */}
        <section id="about" className={classes.section}>
          <Typography className={classes.sectionTitle}>About</Typography>
          <Typography className={classes.aboutText}>
            I am a Master's student in Economics at Arizona State University, with additional training in Computer Science.
          </Typography>
          <Typography className={classes.aboutText}>
            Before joining ASU, I worked as a Research Assistant at Peking University and Nanyang Technological University, contributing to research projects on land economics, firm behavior, political preferences, and investment risk. My work relies heavily on large-scale administrative and survey data, and I have extensive experience in data cleaning, integration, and empirical analysis using Python, Stata, and GIS tools.
          </Typography>
          <Typography className={classes.aboutText}>
            My graduate training at ASU has strengthened my interest in microeconomic theory, particularly information economics. I am currently seeking Research Assistant or predoctoral opportunities and would be very happy to collaborate if given the opportunity.
          </Typography>
        </section>

        {/* Research Section */}
        <section id="research" className={classes.section}>
          <Typography className={classes.sectionTitle}>Research</Typography>

          <Typography className={classes.subTitle}>Selected Publications</Typography>

          <div className={classes.card}>
            <div className={classes.cardContent}>
              <Link href="https://link.springer.com/article/10.1007/s10668-025-06358-2" target="_blank" className={classes.paperTitle}>
                The impact of national ecotourism demonstration zones policy on public services: evidence from Chinese Counties
              </Link>
              <span>, with Jingyi Su and Chunlai Yuan.</span>
              <br />
              <Link href="https://link.springer.com/article/10.1007/s10668-025-06358-2" target="_blank" className={classes.paperLink}>[See paper]</Link>
              <br />
              <span><span className={classes.journalName}>Environment, Development and Sustainability</span>, 2025.</span>
              <div className={classes.tagsContainer}>
                <Tag type="policy" label="Policy" />
                <Tag type="environment" label="Environment" />
                <Tag type="public-services" label="Public Services" />
              </div>
            </div>
            <div className={classes.cardImage}>
              <img src="/images/paper2.png" alt="Ecotourism demonstration zones policy" />
            </div>
          </div>

          <div className={classes.card}>
            <div className={classes.cardContent}>
              <Link href="https://doi.org/10.1016/j.landusepol.2025.107629" target="_blank" className={classes.paperTitle}>
                Impact of China's rural collective construction land marketization reform on unlocking entrepreneurial potential
              </Link>
              <span>, with Chunlai Yuan and Yuxi Fan.</span>
              <br />
              <Link href="https://doi.org/10.1016/j.landusepol.2025.107629" target="_blank" className={classes.paperLink}>[See paper]</Link>
              <br />
              <span><span className={classes.journalName}>Land Use Policy</span>, 2025.</span>
              <div className={classes.tagsContainer}>
                <Tag type="policy" label="Policy" />
                <Tag type="development" label="Development" />
                <Tag type="entrepreneurship" label="Entrepreneurship" />
              </div>
            </div>
            <div className={classes.cardImage}>
              <img src="/images/paper1.jpg" alt="China's rural collective construction land marketization" />
            </div>
          </div>

        </section>

        {/* Code Section */}
        <section id="code" className={classes.section}>
          <Typography className={classes.sectionTitle}>Code & Projects</Typography>
          <Typography className={classes.aboutText}>I wrote a comprehensive Python learning tutorial for beginners. Feel free to download and use it!</Typography>

          <div className={classes.card}>
            <div className={classes.cardContent}>
              <Link href="/python_learning.zip" target="_blank" className={classes.paperTitle}>
                Python Learning Tutorial
              </Link>
              <Typography variant="body2" style={{ marginTop: 8 }}>
                A beginner-friendly Python learning guide. Click to download the tutorial.
              </Typography>
              <div className={classes.tagsContainer}>
                <Tag type="python" label="Python" />
                <Tag type="tutorial" label="Tutorial" />
              </div>
            </div>
            <div className={classes.cardImage}>
              <img src="/images/python.png" alt="Python Learning Tutorial" />
            </div>
          </div>
        </section>

        {/* My Life Section */}
        <section id="life" className={classes.section}>
          <Typography className={classes.sectionTitle}>My Life</Typography>

          <Typography className={classes.subTitle}>Food</Typography>

          <div className={classes.card}>
            <div className={classes.cardContent}>
              <Typography className={classes.paperTitle}>
                All the delicious dishes I've cooked. Here are some of my culinary creations!
              </Typography>
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {imageData.food.map((image, index) => (
                  <div key={index} style={{ width: '100%', paddingBottom: '100%', position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                    <img src={`/images/food/${image}`} alt={`Food ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Typography className={classes.subTitle}>Travel</Typography>

          <div className={classes.card}>
            <div className={classes.cardContent}>
              <Typography className={classes.paperTitle}>
                We want to travel the world!
              </Typography>
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {imageData.travel.map((image, index) => (
                  <div key={index} style={{ width: '100%', paddingBottom: '100%', position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                    <img src={`/images/travel/${image}`} alt={`Travel ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className={classes.section}>
          <Typography className={classes.sectionTitle}>Education</Typography>

          <div className={classes.timelineItem}>
            <Typography variant="h6" className={classes.timelineTitle}>Arizona State University</Typography>
            <Typography className={classes.timelineText}>2025 - present</Typography>
            <Typography className={classes.timelineText}>M.S. Economics</Typography>
          </div>

          <div className={classes.timelineItem}>
            <Typography variant="h6" className={classes.timelineTitle}>Hunan University of Finance and Economics</Typography>
            <Typography className={classes.timelineText}>2019 - 2022</Typography>
            <Typography className={classes.timelineText}>B.S. Computer Science (2nd major)</Typography>
          </div>

          <div className={classes.timelineItem}>
            <Typography variant="h6" className={classes.timelineTitle}>Hunan University of Finance and Economics</Typography>
            <Typography className={classes.timelineText}>2018 - 2022</Typography>
            <Typography className={classes.timelineText}>B.A. International Economics and Trade (1st major)</Typography>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AcademicContent;
