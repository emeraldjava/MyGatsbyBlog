import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import '@fortawesome/fontawesome-free/css/all.css'
import styled from 'styled-components'

import Header from './header'
import './layout.css'
import Navigation from './navigation'
import Sidebar from './sidebar'
import Footer from './footer'
import Metatags from './Metatags'

library.add(faFolderOpen)

const TwoColumnLayoutDiv = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 976px) {
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: center;
  }
`

const ContentDiv = styled.div`
  padding-left: 25px;
  padding-right: 15px;
  max-width: 650px;
`

const OneColumnLayoutDiv = styled.div`
  max-width: 750px;
  margin: 0 auto;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`

const Layout = ({ children, pageType }, props) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Metatags
          title={data.site.siteMetadata.title}
          description={data.site.siteMetadata.description}
        />

        <Header siteTitle={data.site.siteMetadata.title} />
        <Navigation />
        {pageType === 'postList' && (
          <TwoColumnLayoutDiv>
            <Sidebar />
            <ContentDiv>{children}</ContentDiv>
          </TwoColumnLayoutDiv>
        )}
        {pageType === 'blogPost' && (
          <OneColumnLayoutDiv>{children}</OneColumnLayoutDiv>
        )}
        <Footer />
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
