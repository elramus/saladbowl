import React from 'react'
import styled, { CSSProperties } from 'styled-components'
import zElements from '../lib/zElements'
import animateEntrance from '../lib/animateEntrance'
import useEscKeyListener from '../hooks/useEscKeyListener'

const Container = styled('div')`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .shader {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: ${zElements.modalShader};
  }
  .window {
    position: absolute;
    top: 1em;
    right: 1em;
    left: 1em;
    bottom: 1em;
    padding: 2em;
    margin: auto;
    max-width: 35em;
    background: white;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25);
    overflow-y: auto;
    z-index: ${zElements.modalWindow};
    ${animateEntrance('fadeSlideUp', 150)};
  }
`

interface Props {
  onClose: () => void;
  style?: CSSProperties;
}

const Modal: React.FC<Props> = ({
  onClose,
  style,
  children,
}) => {
  useEscKeyListener(onClose)

  return (
    <Container style={style}>
      <div className="shader" onClick={onClose} aria-hidden="true" />
      <div className="window" aria-modal="true" role="dialog">
        {children}
      </div>
    </Container>
  )
}

export default Modal
