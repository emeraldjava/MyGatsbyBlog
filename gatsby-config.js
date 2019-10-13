module.exports = {
  siteMetadata: {
    title: 'Brandon Lehr . com',
    description: 'Online Home of Brandon Lehr',
    siteUrl: 'https://brandonlehr.com',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-62760710-1',
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    // 'gatsby-transformer-sharp',
    // 'gatsby-plugin-sharp',
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'Brandon Lehr',
    //     short_name: 'Brandon Lehr',
    //     start_url: '/',
    //     background_color: '#2196f3',
    //     theme_color: '#2196f3',
    //     display: 'minimal-ui',
    //     icon: 'src/images/favicons/android-chrome-512x512.png', // This path is relative to the root of the site.
    //   },
    // },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: `src/utils/typography`,
        omitGoogleFont: true,
      },
    },

    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/content`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 500,
              withWebp: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          `gatsby-remark-smartypants`,
          'gatsby-remark-static-images',
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-catch-links`,
    'gatsby-plugin-styled-components',
  ],
}
