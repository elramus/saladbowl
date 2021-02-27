import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import animateEntrance from '../lib/animateEntrance'
import { AppState } from '../store'
import { getUserFromUserId } from '../lib/getUserFromUserId'
import { nextAction } from '../store/game/actions'
import { getPlayerFromUserId } from '../lib/getPlayerFromId'
import { useGame } from '../hooks/useGame'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 10em 2em 0 2em;
  color: white;
  font-weight: 900;
  font-style: italic;
  text-align: center;
  animation: becomeGreen 5000ms forwards;
  animation-delay: 500ms;
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
      color: white;
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
  const game = useGame()
  const user = useSelector((state: AppState) => state.user)
  const [currentScreen, setCurrentScreen] = useState(0)

  const nextScreen = () => {
    setCurrentScreen(prev => prev + 1)
  }

  useEffect(() => {
    // Transition to arena colors...
    if (currentScreen === 0) {
      setTimeout(nextScreen, 4000)
    }
    if (currentScreen === 1) {
      // Tossing the salad...
      setTimeout(nextScreen, 3000)
    }
    if (currentScreen === 2) {
      // The teams are...
      setTimeout(nextScreen, 2000)
    }
    if (currentScreen === 3) {
      // Team 1...
      setTimeout(nextScreen, 3500)
    }
    if (currentScreen === 4) {
      // vs Team 2...
      setTimeout(nextScreen, 3500)
    }
    if (currentScreen === 5) {
      // The first player is...
      setTimeout(() => {
        dispatch(
          nextAction({
            userId: user?._id,
            gameId: game._id,
          }),
        )
      }, 3000)
    }
  }, [currentScreen, dispatch, user, game])

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

  const sortedTeams = useMemo(() => {
    const teams = [...game.teams]
    teams.sort((t1, t2) => (t1.name > t2.name ? 1 : -1))

    return teams
  }, [game.teams])

  return (
    <Container>
      <div className="loading">
        <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
        <FontAwesomeIcon icon={['fas', 'salad']} />
      </div>

      {currentScreen === 0 && <div />}
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
          <h1>{sortedTeams[0].name}</h1>
          {sortedTeams[0].userIds.map(userId => (
            <p key={userId}>{getUserFromUserId({ userId, game }).name}</p>
          ))}
        </div>
      )}
      {currentScreen === 4 && (
        <div className="message">
          <h4>vs</h4>
          <h1>{sortedTeams[1].name}</h1>
          {sortedTeams[1].userIds.map(userId => (
            <p key={userId}>{getUserFromUserId({ userId, game }).name}</p>
          ))}
        </div>
      )}
      {currentScreen === 5 && (
        <div className="message">
          <h4>
            {firstPlayer?.user.name} has been randomly chosen to go first!
          </h4>
        </div>
      )}
    </Container>
  )
}

export default PreRoll
