import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

import { HelmetMeta } from './HelmetMeta';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { BackdropVisibilityProvider } from '../components/controls/BackdropVisibility';
import { logCredits } from '../utils/logCredits';
import { Home } from '../pages/Home';
import { PageNotFound } from '../pages/PageNotFound';

// These routes are imported statically on purpose. React.lazy() needs a
// <Suspense> boundary, and renderToString() — which react-snapshot uses to
// prerender the site for SEO — cannot render Suspense (React error #294).
// PageNotFound is a handful of lines, so splitting it saved nothing anyway.
export const App = () => {
  logCredits();

  return (
    <ThemeProvider>
      <BackdropVisibilityProvider>
      <CssBaseline />
      <Router>
        <HelmetMeta />
        <Switch>
          <Route path="/" exact component={Home} />
          {/* The CV is a static PDF in /public — hand the browser straight to it. */}
          <Route
            path="/resume"
            component={() => {
              window.location.replace('/files/resume.pdf');
              return null;
            }}
          />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Router>
      </BackdropVisibilityProvider>
    </ThemeProvider>
  );
};
