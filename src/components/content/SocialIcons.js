import React from 'react';
import { Link, Tooltip, IconButton, Zoom } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Profile from '../../content/profile.json';

const useStyles = makeStyles((theme) => ({
  socialIcons: {
    position: 'absolute',
    top: theme.spacing(6),
    right: theme.spacing(6),
  },
  iconButton: {
    height: '2.5rem',
    width: '2.5rem',
    display: 'block',
    marginBottom: theme.spacing(2),
  },
  icon: { fontSize: '1.25rem' },
}));

export const SocialIcons = () => {
  const classes = useStyles();

  return (
    <div className={classes.socialIcons}>
      {Profile.contacts.map((item) => (
        <Link
          href={item.url}
          key={item.network}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          color="inherit"
        >
          <Tooltip title={item.username} placement="left" TransitionComponent={Zoom}>
            <IconButton color="inherit" aria-label={item.network} className={classes.iconButton}>
              <i className={`${classes.icon} ${item.icon}`} />
            </IconButton>
          </Tooltip>
        </Link>
      ))}
    </div>
  );
};
