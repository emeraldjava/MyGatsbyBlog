const path = require('path')
const _ = require('lodash')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
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
