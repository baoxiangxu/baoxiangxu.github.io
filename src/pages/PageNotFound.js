import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography } from '@material-ui/core';

export const PageNotFound = () => (
  <Container
    maxWidth="sm"
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    }}
  >
    <Typography variant="h3" component="h1" gutterBottom>
      404
    </Typography>
    <Typography variant="body1" color="textSecondary" gutterBottom>
      That page doesn&rsquo;t exist.
    </Typography>
    <Typography variant="body1">
      <Link to="/">Back to the homepage</Link>
    </Typography>
  </Container>
);

// React.lazy() requires a default export.
export default PageNotFound;
