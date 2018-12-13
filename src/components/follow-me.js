import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTwitter,
  faGithub,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { ShareTwitter } from './share';


export const SocialFollowDiv = styled.div`
  display: flex;
  justify-content: flex-start;

  @media (max-width: 650px) {
    justify-content: center;
  }
`

export const ShareGitHub = styled.a`
  color: #23292d;
  &:visited {
    color: #23292d;
  }
`
export const ShareLinkedIn = styled.a`
  color: #0178B5;
  &:visited {
    color: #0178B5;
  }
`

export default function FollowMe() {
  return (
    <SocialFollowDiv>
      <ShareTwitter
        href="https://twitter.com/brandonlehr"
        style={{ marginRight: '5px' }}
      >
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </ShareTwitter>
      <ShareGitHub
        href="https://github.com/blehr"
        style={{ marginRight: '8px' }}
      >
        <FontAwesomeIcon icon={faGithub} size="2x" />
      </ShareGitHub>
      <ShareLinkedIn
        href="/https://www.linkedin.com/in/brandonlehr/"
        style={{ marginRight: '8px' }}
      >
        <FontAwesomeIcon icon={faLinkedinIn} size="2x" />
      </ShareLinkedIn>
      <a href="mailto:blehr.mail@gmail.com">
        <FontAwesomeIcon icon={faEnvelope} size="2x" />
      </a>
    </SocialFollowDiv>
  )
}
