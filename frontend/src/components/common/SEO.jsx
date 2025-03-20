import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  titleTemplate = '%s | Student Attendance System',
  description = 'A modern student attendance tracking system with real-time updates and analytics.',
  canonical,
  image,
  type = 'website',
  keywords = [],
  author = 'Student Attendance System',
  meta = [],
  ...props
}) => {
  // Default meta tags
  const defaultMeta = [
    {
      name: 'description',
      content: description
    },
    {
      name: 'keywords',
      content: keywords.join(', ')
    },
    {
      name: 'author',
      content: author
    },
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'og:type',
      content: type
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: title
    },
    {
      name: 'twitter:description',
      content: description
    }
  ];

  // Add image meta tags if image is provided
  if (image) {
    defaultMeta.push(
      {
        property: 'og:image',
        content: image
      },
      {
        name: 'twitter:image',
        content: image
      }
    );
  }

  // Combine default and custom meta tags
  const metaTags = [...defaultMeta, ...meta];

  // Update document title
  useEffect(() => {
    if (title) {
      document.title = titleTemplate.replace('%s', title);
    }
  }, [title, titleTemplate]);

  return (
    <Helmet {...props}>
      <title>{titleTemplate.replace('%s', title)}</title>
      {canonical && <link rel="canonical" href={canonical} />}
      {metaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  titleTemplate: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.string,
  meta: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      content: PropTypes.string,
      property: PropTypes.string
    })
  )
};

// Page SEO Component
export const PageSEO = ({
  title,
  description,
  image,
  ...props
}) => (
  <SEO
    title={title}
    description={description}
    image={image}
    type="website"
    {...props}
  />
);

PageSEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string
};

// Article SEO Component
export const ArticleSEO = ({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  authors = [],
  section,
  tags = [],
  ...props
}) => {
  const articleMeta = [
    {
      property: 'article:published_time',
      content: publishedTime
    },
    {
      property: 'article:modified_time',
      content: modifiedTime || publishedTime
    },
    {
      property: 'article:section',
      content: section
    },
    ...authors.map(author => ({
      property: 'article:author',
      content: author
    })),
    ...tags.map(tag => ({
      property: 'article:tag',
      content: tag
    }))
  ];

  return (
    <SEO
      title={title}
      description={description}
      image={image}
      type="article"
      meta={articleMeta}
      {...props}
    />
  );
};

ArticleSEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  publishedTime: PropTypes.string.isRequired,
  modifiedTime: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.string),
  section: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string)
};

// Profile SEO Component
export const ProfileSEO = ({
  title,
  description,
  image,
  firstName,
  lastName,
  username,
  ...props
}) => {
  const profileMeta = [
    {
      property: 'profile:first_name',
      content: firstName
    },
    {
      property: 'profile:last_name',
      content: lastName
    },
    {
      property: 'profile:username',
      content: username
    }
  ];

  return (
    <SEO
      title={title}
      description={description}
      image={image}
      type="profile"
      meta={profileMeta}
      {...props}
    />
  );
};

ProfileSEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  username: PropTypes.string
};

export default SEO;