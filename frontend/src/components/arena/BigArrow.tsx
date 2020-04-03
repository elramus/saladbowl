import React from 'react'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSpaceKeyListener from '../../hooks/useSpaceKeyListener'

const Container = styled('button')`
  width: 100%;
  max-width: 13em;
  height: 7em;
  border-radius: 25px;
  padding-bottom: 1em;
  background: ${(props) => props.theme.green};
  box-shadow: 7px 7px 14px #93bca0, -7px -7px 14px #b2eac4;
  transition: box-shadow 50ms ease-out, background 50ms ease-out;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: ${(props) => props.theme.ms(5)};
    }
  }
  &:active {
    box-shadow: 0 0 0 #93bca0;
    background: ${(props) => props.theme.darkGreen};
  }
`

interface Props {
  onClick: () => void;
}

const BigArrow = ({
  onClick,
}: Props) => {
  useSpaceKeyListener(onClick)

  return (
    <Container onClick={onClick} className="big-arrow">
      <span>
        <FontAwesomeIcon icon={['fas', 'arrow-alt-circle-right']} />
      </span>
    </Container>
  )
}

export default BigArrow
