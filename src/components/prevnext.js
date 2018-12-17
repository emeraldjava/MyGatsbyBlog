import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons'

const PrevNextUl = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 15px;
`

export const PrevLinkDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding-right: 8px;
`
export const NextLinkDiv = styled.div`
  display: flex;
  font-size: 0.8rem;
  align-items: center;
  padding-left: 8px;
`

const PrevNext = ({ prev, next }) => {
  return (
    <PrevNextUl>
      {prev && (
        <PrevLinkDiv>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="lg"
            style={{ marginRight: '8px', opacity: '.9' }}
          />
          <a href={prev.fields.slug}> {prev.frontmatter.title}</a>
        </PrevLinkDiv>
      )}
      {next && (
        <NextLinkDiv>
          <a href={next.fields.slug}>{next.frontmatter.title} </a>
          <FontAwesomeIcon
            icon={faChevronRight}
            size="lg"
            style={{ marginLeft: '8px', opacity: '.9' }}
          />
        </NextLinkDiv>
      )}
    </PrevNextUl>
  )
}

export default PrevNext
