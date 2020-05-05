import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import animateEntrance from '../lib/animateEntrance'
import { AppState } from '../store'
import useMountEffect from '../hooks/useMountEffect'
import { getUserFromUserId } from '../lib/getUserFromUserId'
import { nextAction } from '../store/game/actions'
import { getPlayerFromUserId } from '../lib/getPlayerFromId'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 10em 2em 0 2em;
  color: ${props => props.theme.darkGreen};
  font-weight: 900;
  font-style: italic;
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
      font-size: ${props => props.theme.ms(2)};
      color: ${props => props.theme.darkGreen};
      &.fa-spinner-third {
        font-size: ${props => props.theme.ms(5)};
      }
    }
  }
  .message {
    padding-top: 1em;
    ${animateEntrance('fadeSlideUp', 750)}
    h1 {
      margin-bottom: 1em;
    }
    p {
      font-size: ${props => props.theme.ms(1)};
      margin-bottom: 0;
    }
  }
`

const PreRoll = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)

  const [currentScreen, setCurrentScreen] = useState(1)

  useMountEffect(() => {
    // Starts with "Tossing the salad..."
    setTimeout(() => {
      // "The teams are..."
      setCurrentScreen(2)
    }, 2000)
    setTimeout(() => {
      // "Team 1..."
      setCurrentScreen(3)
    }, 4000)
    setTimeout(() => {
      // "vs Team 2..."
      setCurrentScreen(4)
    }, 7000)
    setTimeout(() => {
      // "The first player is..."
      setCurrentScreen(5)
    }, 10000)
    setTimeout(() => {
      // After 12 seconds, send a next-action to the server.
      if (user && game && user._id === game.creatorId) {
        dispatch(nextAction({
          userId: user._id,
          gameId: game._id,
        }))
      }
    }, 12000)
  })

  const firstPlayer = useMemo(() => {
    const firstTeam = game?.teams.find(t => t._id === game?.preRoll.firstTeamId)
    if (game && firstTeam) {
      return getPlayerFromUserId({
        userId: firstTeam.userIds[firstTeam.lastPrompterIndex],
        game,
      })
    }
    return null
  }, [game])

  if (!game) return <div />

  return (
    <Container>
      <div className="loading">
        <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
        <FontAwesomeIcon icon={['fas', 'salad']} />
      </div>

      {currentScreen === 1 && (
        <div className="message">
          <p>Tossing the salad...</p>
        </div>
      )}
      {currentScreen === 2 && (
        <div className="message">
          <p>The teams are...</p>
        </div>
      )}
      {currentScreen === 3 && (
        <div className="message">
          <h1>{game.teams[0].name}</h1>
          {game.teams[0].userIds.map(userId => (
            <p key={userId}>{getUserFromUserId({ userId, game }).name}</p>
          ))}
        </div>
      )}
      {currentScreen === 4 && (
        <div className="message">
          <h4>vs</h4>
          <h1>{game.teams[1].name}</h1>
          {game.teams[1].userIds.map(userId => (
            <p key={userId}>{getUserFromUserId({ userId, game }).name}</p>
          ))}
        </div>
      )}
      {currentScreen === 5 && (
        <div className="message">
          <h4>{firstPlayer?.user.name} has been randomly chosen to go first!</h4>
        </div>
      )}
    </Container>
  )
}

export default PreRoll
