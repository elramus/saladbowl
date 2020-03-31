import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import animateEntrance from '../../lib/animateEntrance'
import { HelperText } from '../styled/HelperText'
import { AppState } from '../../store'
import { joinTeam } from '../../store/game/actions'
import { Team } from '../../store/game/types'
import useScrollToTop from '../../hooks/useScrollToTop'

const Container = styled('div')`
  ${animateEntrance('fadeSlideUp', 500)};
  .teams {
    li {
      button {
        width: 100%;
        padding: 1rem;
        border: 1px solid ${(props) => props.theme.green};
        border-radius: 10px;
        margin-bottom: 2em;
        transition: background 150ms ease-out, color 150ms ease-out;
      }
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        h2 {
          margin-right: auto;
        }
        .icon-container {
          margin-left: auto;
          opacity: 0;
          transition: opacity 150ms ease-out;
          svg {
            font-size: ${(props) => props.theme.ms(2)};
          }
        }
      }
      .player-list {
        text-align: left;
      }
      &.selected {
        button {
          color: white;
          background: ${(props) => props.theme.green};
        }
        .icon-container {
          opacity: 1;
        }
      }
    }
  }
`

const PickTeamsTab = () => {
  const game = useSelector((state: AppState) => state.game)
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const dispatch = useDispatch()

  const selectedTeam = useMemo<string | null>(() => {
    if (game && authedUser) {
      const playerTeam = game.teams.find((team) => team.userIds.some((pId) => pId === authedUser._id))
      if (playerTeam) return playerTeam._id
    }
    return null
  }, [game, authedUser])

  useScrollToTop()

  function handleTeamClick(teamId: string) {
    if (game) {
      dispatch(joinTeam(game._id, teamId))
    }
  }

  function getPlayersList(team: Team) {
    const players: string[] = []
    if (game) {
      team.userIds.forEach((pId) => {
        const user = game.players.find((p) => p.user._id === pId)?.user
        if (user) players.push(user.name)
      })
    }
    return players.join(', ')
  }

  if (!game) return <div />

  return (
    <Container>
      <HelperText>Who do you want to be stuck with in Round 3?</HelperText>
      <ul className="teams">
        {game.teams
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((t) => (
            <li
              key={t._id}
              className={t._id === selectedTeam ? 'selected' : ''}
            >
              <button type="button" onClick={() => handleTeamClick(t._id)}>
                <span className="title">
                  <h2>{t.name}</h2>
                  <div className="icon-container">
                    <FontAwesomeIcon icon={['fas', 'check-circle']} />
                  </div>
                </span>
                <p className="player-list">{getPlayersList(t)}</p>
              </button>
            </li>
          ))}
      </ul>
    </Container>
  )
}

export default PickTeamsTab
