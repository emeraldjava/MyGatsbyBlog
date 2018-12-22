---
layout: post
title: From Jekyll to Gatsby - a Blog Migration
date: '2018-12-22'
categories: ['gatsby', 'jekyll']

comments: true
description:  How I migrated my blog from Jekyll to Gatsby.
image: "../images/gatsby.svg"
featured_image: "../images/gatsby.svg"
featured_image_max_width: 300px
---

Back in [September of 2016](/jekyll/i-built-this/2016/09/06/welcome-to-my-new-jekyll-blog) I moved this blog from WordPress to [Jekyll](https://jekyllrb.com/). I was interested in speed that a static site generator provides. At the time, I looked into the available solutions out there and decided to go with Jekyll, as it was very popular and had great support for github pages. Overall, I was pleased with with Jekyll, even though it is implemented in Ruby, a language and ecosystem with which I had no previous experience with.


## Gatsby

![gatsby logo](../images/gatsby.svg)


Fast forward to today. There are a multitude of new options for static site generators. The one that has been filling up my twitter feed for the past year is [Gatsby](https://www.gatsbyjs.org/). I love that it is built with Javascript and React, an ecosystem that I have been heavily invested in for years.


## Getting Started

One of the biggest strengths of Gatsby is its active, friendly community. There are tons of plugins and articles, excellent documentation, and features you probably haven't even thought of. 

I started my adventures where we all begin, the [getting started tutorial](https://www.gatsbyjs.org/tutorial/). I'm not going to copy and paste it here, I'll just expand upon the relevant steps.

There are many [starter templates](https://www.gatsbyjs.org/starters/?v=2) that can speed up development, but I just used the cli to install the default. I had the crazy idea of building from scratch. I wanted to know how everything fit together.

To be honest, I followed this [blog post](https://reactgo.com/gatsby-advanced-blog-tutorial/) very closely, as it covered much of what I needed in my particular application. When you finish up here, head over and follow along, returning to find the solutions I used in this migration.

## My Biggest Issue

While I ran Jekyll, I set up the post urls to include the tags that I attached to each post. So, a post such as My React Post, tagged with React would compile to /YYYY/MM/DD/react/my-react-post. This isn't the default with most configurations of gatsby. The problem was that if I choose to use the new way, all links that I had posted in social media or other places, would break. 

Another difference between Jekyll and Gatsby, is that with jekyll I simply had a folder full of posts which were markdown files. With Gatsby, it seems as though most prefer to have a folder named with the date and a post markdown file inside of it. This really isn't a big issue, but being lazy, I didn't want to change everything around that much.

Thankfully, everything in Gatsby can be configured. All of this is handled in the gatsby-node.js file. The biggest take away here is the last function, onCreateNode. It is here that I parse out the date from the filename and format the categories or tags to build the new slug.

```javascript
const path = require('path')
const _ = require('lodash')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const categoryTemplate = path.resolve('src/templates/categories.js')
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 1000
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                  categories
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          console.log(result.errors)
          return reject(result.errors)
        }
        const blogTemplate = path.resolve('./src/templates/blog-post.js')

        const posts = result.data.allMarkdownRemark.edges
        const postsPerPage = 10;
        const numPages = Math.ceil(posts.length / postsPerPage);

        _.times(numPages, i => {
          createPage({
            path: i === 0 ? `/` : `/${i + 1}`,
            component: path.resolve('./src/templates/index.js'),
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1
            },
          });
        });
        posts.forEach(({ node }, index) => {
          createPage({
            path: node.fields.slug,
            component: blogTemplate,
            context: {
              slug: node.fields.slug,
              prev: index === 0 ? null : posts[index - 1],
              next: index === result.length - 1 ? null : posts[index + 1],
            }, // additional data can be passed via context
          })
        })

        // Tag pages:
        let categories = []
        // Iterate through each post, putting all found categories into `categories`
        _.each(posts, edge => {
          if (_.get(edge, 'node.frontmatter.categories')) {
            categories = categories.concat(edge.node.frontmatter.categories)
          }
        })
        // Eliminate duplicate categories
        categories = _.uniq(categories)

        // Make tag pages
        categories.forEach(tag => {
          createPage({
            path: `/categories/${_.kebabCase(tag)}/`,
            component: categoryTemplate,
            context: {
              tag,
            },
          })
        })
        return
      })
    )
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const { categories } = node.frontmatter

    const filename = createFilePath({ node, getNode, basePath: `pages` })
    // get the date and title from the file name
    const [, date, title] = filename.match(
      /^\/([\d]{4}-[\d]{2}-[\d]{2})-{1}(.+)\/$/
    )

    // create a new slug concatenating everything

    const categorySlug = categories.join('/')
    const dateSlug = date.replace(/-/g, '/')

    const slug = `/${categorySlug}/${dateSlug}/${title}`

    createNodeField({ node, name: `slug`, value: slug })

    // save the date for later use
    createNodeField({ node, name: `date`, value: date })
  }
}

```


## Gatsby Image

[Gatsby Image](https://www.gatsbyjs.org/packages/gatsby-image/) is both amazing and frustrating, but is definitely worth the struggle. Here are a few of the features.

- Resize large images to the size needed by your design
- Generate multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Strip all unnecessary metadata and optimize JPEG and PNG compression
- Efficiently lazy load images to speed initial page load and save bandwidth
- Use the “blur-up” technique or a ”traced placeholder” SVG to show a preview of the image while it loads
- Hold the image position so your page doesn’t jump while images load

So, what's the problem? Most of use are used to writing an img tag with src pointing to the location of the image. With Gatsby Image and most other things Gatsby, it is always best to do things the Gatsby way. This is how you can utilize all of the awesome features that are are available. With images it is best to query them with graphql. Inside of markdown, there are plugins that handle this automatically. It is when you want an image outside of a post, such as a header or sidebar that things get interesting. Enter the static query. Here is an example. Side note - I'm also using styled-components.

```javascript
import React from 'react'
import styled from 'styled-components'
import { StaticQuery, graphql, Link } from 'gatsby'
import Img from 'gatsby-image'

import FollowMe from './follow-me';

const StyledSidebar = styled.div`
  width: 300px;
  height: 100%;

  @media (max-width: 976px) {
    width: 100%;
    max-width: 600px;
  }
`

const SidebarBlock = styled.div`
  padding: 5px;
  font-size: 0.9rem;
`

export default function Sidebar(props) {
  return (
    <StaticQuery
      query={graphql`
        query {
          file(relativePath: { eq: "profilefunky.jpg" }) {
            childImageSharp {
              fixed(width: 150, height: 150) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
        }
      `}
      render={data => {
        return (
          <StyledSidebar>
            <SidebarBlock>
              <Img
                fixed={data.file.childImageSharp.fixed}
                imgStyle={{ borderRadius: '20px', marginRight: 'auto' }}
              />
            </SidebarBlock>

            <SidebarBlock>
              <FollowMe />
            </SidebarBlock>
          </StyledSidebar>
        )
      }}
    />
  )
}

```

Once you realize how the static queries work, its not so bad.

## Gatsby Config

I should have probably mentioned, that in the end the two most important files are the gatsby-node.js, which I mentioned earlier, and the gatsby-config.js. These control how the posts and pages are generated and how the plugins interact with the site and build process. To get a feel for how it works, I'll post mine here.

```javascript
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
        trackingId: 'UA-xxxxxxxx-1',
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Brandon Lehr',
        short_name: 'Brandon Lehr',
        start_url: '/',
        background_color: '#2196f3',
        theme_color: '#2196f3',
        display: 'minimal-ui',
        icon: 'src/images/favicons/android-chrome-512x512.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `/src/utils/typography`,
        omitGoogleFont: true,
      },
    },

    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/content`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
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
          `gatsby-remark-static-images`,
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-styled-components`,
  ],
}

```

## Learn More

If you are looking for more help, feel free to have a look at this site's [repo](https://github.com/blehr/MyGatsbyBlog). Here you can see all of the configuration and setup required to get things up and running.

