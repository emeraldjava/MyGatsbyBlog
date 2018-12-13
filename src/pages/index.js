import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components'
import Layout from '../components/layout'

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

const IndexPage = props => {
  const postList = props.data.allMarkdownRemark
  return (
    <Layout pageType="postList" >
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
    </Layout>
  )
}
export default IndexPage
export const listQuery = graphql`
  query ListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          fields {
            slug
          }
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM Do YYYY")
            title
            categories
            featured_image_max_width
            featured_image {
              publicURL
            }
            featured_image {
              childImageSharp {
                resize(width: 1500, height: 1500) {
                  src
                }
                fluid(maxWidth: 768) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`
