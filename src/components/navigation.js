import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const NavUl = styled.ul`
  display: flex;
  list-style: none;
  justify-content: center;
  font-size: .8rem;
  li {
    margin-right: 15px;
    font-weight: bold;
  }
`

const TitleLi = styled.li`
  opacity: .8;
`

export default function Navigation({ title }) {
  return (
    <div>
      <NavUl>
        <li><Link to="/" >Home</Link></li>
        {title && <TitleLi>/ {title}</TitleLi>}
      </NavUl>
    </div>
  )
}
