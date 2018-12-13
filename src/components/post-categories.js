import React from 'react'
import { Link } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StyledUl, StyledLi } from './post-categories-styles'
import { titleCaseCategories } from '../utils'

export default function PostCategories(props) {
  return (
    <StyledUl>
      <StyledLi>
        <FontAwesomeIcon icon={['far', 'folder-open']} />
      </StyledLi>
      {props.categories.map((cat, i) => {
        return (
          <StyledLi key={i}>
            <Link to={`/categories/${cat}`}>{titleCaseCategories(cat)}</Link>
            {i !== props.categories.length - 1 ? ',' : ''}
          </StyledLi>
        )
      })}
    </StyledUl>
  )
}
