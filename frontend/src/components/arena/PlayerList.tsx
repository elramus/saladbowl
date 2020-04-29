import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import animateEntrance from '../../lib/animateEntrance'
import { Team } from '../../store/game/types'
import { getUserFromUserId } from '../../lib/getUserFromUserId'
import { AppState } from '../../store'

const List = styled('ul')`
  margin: 1rem 0;
  text-align: center;
  ${animateEntrance('fadeSlideDown', 100)}
  li {
    line-height: 1em;
    margin-bottom: 0.5em;
  }
`

interface Props {
  team: Team;
}

const PlayerList = ({
  team,
}: Props) => {
  const game = useSelector((state: AppState) => state.game)

  if (!game) return <div />

  return (
    <List>
      {team.userIds.map(userId => (
        <li key={userId}>{getUserFromUserId({ userId, game }).name}</li>
      ))}
    </List>
  )
}

export default PlayerList
