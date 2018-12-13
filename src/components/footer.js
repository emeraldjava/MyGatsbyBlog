import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 50px;
  background: #23292d;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #ffffff;
`

export default function Footer() {
  return (
    <StyledFooter>
      <div>
        <p>&copy; 2019 Brandon Lehr</p>
      </div>
    </StyledFooter>
  )
}
