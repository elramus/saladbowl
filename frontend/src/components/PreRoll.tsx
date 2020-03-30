import React from 'react'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import animateEntrance from '../lib/animateEntrance'
import { AppState } from '../store'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 2em;
  text-align: center;
  .loading {
    position: relative;
    width: 5em;
    height: 5em;
    display: flex;
    align-items: center;
    justify-content: center;
    .svg-inline--fa {
      position: absolute;
      font-size: ${(props) => props.theme.ms(2)};
      color: ${(props) => props.theme.darkGreen};
      &.fa-spinner-third {
        font-size: ${(props) => props.theme.ms(5)};
      }
    }
  }
  .message {
    padding-top: 1em;
    ${animateEntrance('fadeSlideUp', 750)}
  }
  p {
    font-size: ${(props) => props.theme.ms(1)};
    color: ${(props) => props.theme.darkGreen};
    font-weight: 900;
    font-style: italic;
  }
`

const PreRoll = () => {
  const game = useSelector((state: AppState) => state.game)
  const users = useSelector((state: AppState) => state.users)
  const firstPlayer = users.find((u) => u.user._id === game?.preRoll.firstUserId)

  if (!game) return <div />

  return (
    <Container>
      <div className="loading">
        <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
        <FontAwesomeIcon icon={['fas', 'salad']} />
      </div>
      {!game.preRoll.firstUserId && (
        <div className="message">
          <p>Tossing the salad...</p>
        </div>
      )}
      {game.preRoll.firstUserId && (
        <div className="message">
          <p>{firstPlayer?.user.name} was randomly chosen to go first!</p>
        </div>
      )}
    </Container>
  )
}

export default PreRoll
