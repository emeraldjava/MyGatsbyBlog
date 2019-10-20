import React from 'react'
import PropTypes from 'prop-types'

// Components
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import styled from 'styled-components'
import Metatags from '../components/Metatags'
import { titleCaseCategories } from '../utils/index'

const TagHeaderDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  h2 {
    margin: 0;
    margin-left: 15px;
  }
`

const NumberBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background: #2096f3;
  width: 35px;
  height: 35px;
  padding: 5px;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: bold;
`

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const { description, siteUrl } = data.site.siteMetadata

  const titleCased = titleCaseCategories(tag)

  return (
    <>
      <Metatags
        title={`${titleCased} on Brandon Lehr . com`}
        description={description}
        thumbnail={siteUrl + data.file}
        url={siteUrl}
        pathname={`/categories/${tag}`}
      />
      <Layout pageType="postList" title={titleCased} location={location} showNav>
        <TagHeaderDiv>
          <NumberBadge>{totalCount}</NumberBadge>
          <h2>{titleCased}</h2>
        </TagHeaderDiv>
        <ul>
          {edges.map(({ node }) => {
            const { title } = node.frontmatter
            const { slug } = node.fields
            return (
              <li key={slug}>
                <Link to={slug}>{title}</Link>
              </li>
            )
          })}
        </ul>
        <Link to="/categories">All Categories</Link>
      </Layout>
    </>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              // path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: [String]) {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { in: $tag } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
