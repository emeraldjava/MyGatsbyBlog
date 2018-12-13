import React from 'react'
import styled from 'styled-components'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import PostCategories from '../components/post-categories'
import Metatags from '../components/Metatags'
import PrevNext from '../components/prevnext'
import Share from '../components/share'

const PostDate = styled.p`
  margin: 0;
  margin-right: 8px;
  font-size: 0.9rem;
`

const Spacer = styled.div`
  width: 100%;
  height: 25px;
`

function BlogPost(props) {
  const post = props.data.markdownRemark
  const url = props.data.site.siteMetadata.siteUrl
  const thumbnail =
    post.frontmatter.featured_image &&
    post.frontmatter.featured_image.childImageSharp
      ? post.frontmatter.featured_image.childImageSharp.resize.src
      : post.frontmatter.featured_image
      ? post.frontmatter.featured_image.publicURL
      : ''
  const { title, date, categories, description } = post.frontmatter
  const { prev, next } = props.pageContext

  return (
    <Layout>
      <Metatags
        title={title}
        description={description}
        thumbnail={url + thumbnail}
        url={url}
        pathname={props.location.pathname}
      />
      <div>
        <PostDate>{date}</PostDate>
        <PostCategories categories={categories} />

        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <Spacer />
        <hr />
        <Share title={title} url={url} pathname={props.location.pathname} />
        <PrevNext prev={prev && prev.node} next={next && next.node} />
      </div>
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM Do YYYY")
        description
        categories
        featured_image {
          publicURL
        }
        featured_image {
          childImageSharp {
            resize(width: 1500, height: 1500) {
              src
            }
            fluid(maxWidth: 786) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
