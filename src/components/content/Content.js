import React from 'react';
import { Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextDecrypt } from './TextDecrypt';
import Profile from '../../content/profile.json';
import { FirstName } from '../../utils/getName';

// "a Econ student" -> "an Econ student"
const article = (word = '') => (/^[aeiou]/i.test(word.trim()) ? 'an' : 'a');

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: 'auto',
    marginBottom: 'auto',
    // Padding, not margin: a margin on a full-width container pushes the whole
    // page sideways and puts the site into horizontal scroll.
    '@media (max-width: 768px)': {
      paddingLeft: theme.spacing(4),
    },
  },
}));

export const Content = () => {
  const classes = useStyles();

  return (
    <Container component="main" className={classes.main} maxWidth="sm">
      <Typography variant="h2" component="h1" gutterBottom>
        <TextDecrypt text={`${Profile.heroGreeting} ${FirstName}`} />
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        <TextDecrypt text={`${article(Profile.heroRole)} ${Profile.heroRole}`} />
        <TextDecrypt text={Profile.heroPlace} />
      </Typography>
    </Container>
  );
};
