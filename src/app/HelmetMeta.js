import React from 'react';
import Helmet from 'react-helmet';
import Profile from '../content/profile.json';
import Theme from '../content/theme.json';

const SITE_URL = 'https://baoxiangxu.github.io';

export const HelmetMeta = () => {
  const title = `${Profile.name} | Economics, Arizona State University`;
  const description = Profile.about.paragraphs[0];

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="theme-color" content={Theme.primary} />
      <meta name="author" content={Profile.name} />
      <meta name="description" content={description} />
      <meta name="keywords" content={Profile.seoKeywords} />
      <link rel="canonical" href={`${SITE_URL}/`} />

      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={Profile.name} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}/social-image.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}/social-image.png`} />
    </Helmet>
  );
};
