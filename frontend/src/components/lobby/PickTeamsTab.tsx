import React, { useMemo } from 'react'
import styled from 'styled-components'
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
        border: 1px solid ${props => props.theme.green};
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
            font-size: ${props => props.theme.ms(2)};
          }
        }
      }
      .player-list {
        text-align: left;
      }
      &.selected {
        button {
          color: white;
          background: ${props => props.theme.green};
        }
        .icon-container {
          opacity: 1;
        }
      }
    }
  }
`

interface Props {
  onChooseTeam: () => void
}

const PickTeamsTab = ({ onChooseTeam }: Props) => {
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)
  const dispatch = useDispatch()

  const selectedTeamId = useMemo<string | null>(() => {
    if (game && user) {
      const playerTeam = game.teams.find(team =>
        team.userIds.some(pId => pId === user._id),
      )
      if (playerTeam) return playerTeam._id
    }
    return null
  }, [game, user])

  useScrollToTop()

  function handleTeamClick(teamId: string) {
    if (game) {
      window.scrollTo(0, 0) // scroll to top of page so they can see the ready button.
      dispatch(joinTeam(game._id, teamId, onChooseTeam))
    }
  }

  function getTeamPlayers(team: Team) {
    const players: string[] = []
    if (game) {
      // The teams have an array of user Ids. We'll connect them to the game
      // players list and return a list of names.
      team.userIds.forEach(pId => {
        const pUser = game.players.find(p => p.user._id === pId)?.user
        if (pUser) players.push(pUser.name)
      })
    }
    return players
  }

  if (!game) return <div />

  return (
    <Container>
      <HelperText>Who do you want to be stuck with in Round 3?</HelperText>
      <ul className="teams">
        {game.teams
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map(t => (
            <li
              key={t._id}
              className={t._id === selectedTeamId ? 'selected' : ''}
            >
              <button type="button" onClick={() => handleTeamClick(t._id)}>
                <span className="title">
                  <h2>
                    {t.name} ({getTeamPlayers(t).length})
                  </h2>
                  <div className="icon-container">
                    <FontAwesomeIcon icon={['fas', 'check-circle']} />
                  </div>
                </span>
                <p className="player-list">{getTeamPlayers(t).join(', ')}</p>
              </button>
            </li>
          ))}
      </ul>
    </Container>
  )
}

export default PickTeamsTab
