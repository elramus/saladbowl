import React from 'react'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled('div')`
  position: relative;
  text-align: center;
  padding-top: 2em;
  margin-bottom: 2em;
  .fa-salad {
    color: ${(props) => props.theme.darkGreen};
    margin-right: 0.75rem;
  }
`

const LogoHeader = () => {
  return (
    <Container>
      <h1>
        <FontAwesomeIcon icon={['fas', 'salad']} />
        Salad Bowl
      </h1>
    </Container>
  )
}

export default LogoHeader
