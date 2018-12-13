import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import '@fortawesome/fontawesome-free/css/all.css'
import styled from 'styled-components'

import Header from './header'
import './layout.css'
import Navigation from './navigation'
import Sidebar from './sidebar'

library.add(faFolderOpen)

const LayoutDiv = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* flex-wrap: wrap; */

  @media (max-width: 976px) {
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: center;
  }
`

const ContentDiv = styled.div`
  padding-left: 25px;
  padding-right: 15px;
`

const Layout = ({ children }) => (
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
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Online Home of Brandon Lehr' },
            { name: 'keywords', content: 'Tech, Web, React, Development' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <Header siteTitle={data.site.siteMetadata.title} />
        <Navigation />
        <LayoutDiv>
          <Sidebar />
          <ContentDiv>{children}</ContentDiv>
        </LayoutDiv>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
