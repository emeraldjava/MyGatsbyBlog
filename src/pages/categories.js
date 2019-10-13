import React from 'react'
import PropTypes from 'prop-types'

// Utilities
import kebabCase from 'lodash/kebabCase'

// Components
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title, description, siteUrl },
    },
  },
}) => {
  return (
    <div>
      <Layout pageType="postList" title="Categories" showNav>
        <h2>Categories</h2>
        <ul>
          {group.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={`/categories/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue.toUpperCase().replace(/-/g, ' ')} (
                {tag.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  )
}

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`
