import React from 'react'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSpaceKeyListener from '../../hooks/useSpaceKeyListener'

const Container = styled('button')`
  width: 100%;
  max-width: 15em;
  border-radius: 50px;
  height: 10em;
  border-radius: 50px;
  background: ${(props) => props.theme.green};
  box-shadow: 12px 12px 24px #93bca0, -12px -12px 24px #bbf0cc;
  transition: box-shadow 50ms ease-out, background 50ms ease-out;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: ${(props) => props.theme.ms(6)};
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
