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
import GoogleAd from './google_ad'

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

const Layout = ({ children, pageType, title, showNav }) => (
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
        <Header siteTitle={data.site.siteMetadata.title} />
        <GoogleAd
          client="ca-pub-9453781066915703"
          slot="3728415001"
          format="auto"
          wrapperDivStyle={{ width: '100%', minHeight: '50px', marginBottom: '15px' }}
        />
        {showNav && <Navigation title={title} />}
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
