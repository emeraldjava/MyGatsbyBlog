import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components'
import Layout from '../components/layout'
import Metatags from '../components/Metatags'

const StyledImage = styled.div`
  margin: auto;
  max-width: 300px;
  height: 250px;
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledInnerImageDiv = styled.div`
  width: 100%;
`

const PostList = styled.div`
  max-width: 600px;
  border-radius: 25px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  margin-bottom: 2rem;
  padding: 1.25rem;
  transition: all 500ms;
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  h3 {
    text-align: center;
    margin: 0;
  }
`

const DateSpan = styled.span`
  color: rgba(0, 0, 0, 0.6);
  font-weight: bold;
  font-size: 0.8rem;
`

const PageNavigation = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0;
`

const IndexPage = props => {
  const postList = props.data.allMarkdownRemark
  const { currentPage, numPages } = props.pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
  const nextPage = (currentPage + 1).toString()
  const { title, description, siteUrl } = props.data.site.siteMetadata
  return (
    <Layout pageType="postList" location={props.location}>
      <Metatags
        title={title}
        description={description}
        thumbnail="thumb"
        url={siteUrl}
        pathname={props.location.pathname}
      />
      {postList.edges.map(({ node }, i) => (
        <PostList key={i}>
          <DateSpan>{node.frontmatter.date}</DateSpan>
          <Link to={node.fields.slug} className="link">
            {node.frontmatter.featured_image &&
              node.frontmatter.featured_image.childImageSharp && (
                <StyledImage>
                  <StyledInnerImageDiv>
                    <Img
                      fluid={
                        node.frontmatter.featured_image.childImageSharp.fluid
                      }
                    />
                  </StyledInnerImageDiv>
                </StyledImage>
              )}
            {node.frontmatter.featured_image &&
              !node.frontmatter.featured_image.childImageSharp && (
                <StyledImage>
                  <StyledInnerImageDiv>
                    <img
                      src={node.frontmatter.featured_image.publicURL}
                      alt="featured"
                    />
                  </StyledInnerImageDiv>
                </StyledImage>
              )}
            <div>
              <h3>{node.frontmatter.title}</h3>

              {/* <p>{node.excerpt}</p> */}
            </div>
          </Link>
        </PostList>
      ))}
      <PageNavigation>
        {!isFirst && (
          <Link to={prevPage} rel="prev">
            ← Previous Page
          </Link>
        )}
        {Array.from({ length: numPages }, (_, i) => (
          <li
            key={`pagination-number${i + 1}`}
            style={{
              margin: 0,
            }}
          >
            <Link
              style={i + 1 === currentPage ? { fontWeight: 'bold' } : {}}
              to={`/${i === 0 ? '' : i + 1}`}
            >
              {i + 1}
            </Link>
          </li>
        ))}
        {!isLast && (
          <Link to={nextPage} rel="next">
            Next Page →
          </Link>
        )}
      </PageNavigation>
    </Layout>
  )
}
export default IndexPage
export const listQuery = graphql`
  query ListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          frontmatter {
            date(formatString: "MMMM Do YYYY")
            title
            categories
            featured_image_max_width
            featured_image {
              publicURL
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
        title
        description
      }
    }
  }
`
