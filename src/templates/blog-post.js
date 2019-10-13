import React from 'react'
import styled from 'styled-components'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import { DiscussionEmbed } from "disqus-react";
import PostCategories from '../components/post-categories'
import Metatags from '../components/Metatags'
import PrevNext from '../components/prevnext'
import Share from '../components/share'
import AuthorBio from '../components/author-bio';

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
  const disqusShortname = "brandonlehr";
    const disqusConfig = {
      identifier: post.id,
      title: post.frontmatter.title,
      url: props.location.href
    };

  return (
    <Layout pageType="blogPost" title={title} showNav >
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
        {/* Author Bio */}
        <AuthorBio />
        <hr />
        <Share title={title} url={url} pathname={props.location.pathname} />
        <PrevNext prev={prev && prev.node} next={next && next.node} />
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "MMMM Do YYYY")
        description
        categories
        featured_image {
          publicURL
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
