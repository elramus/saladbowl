import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store'
import { ifEnterOrSpace } from '../../lib/ifEnterOrSpace'
import PlayerList from './PlayerList'

interface StyleProps {
  expanded: boolean
  expandable: boolean
}

const Container = styled('div')<StyleProps>`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: 1rem;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  transition: background 100ms ease-out;
  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .round {
    position: relative;
    padding-top: 1em;
    text-align: center;
    p {
      line-height: 1.35;
      font-size: ${props => props.theme.ms(-1)};
    }
    svg {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 0.25rem;
      transition: transform 100ms ease-out;
      transform: rotate(${props => (props.expanded ? '180deg' : '0deg')});
    }
  }
  h5 {
    margin: 0 0 0.5rem 0;
  }
  h1 {
    font-size: ${props => props.theme.ms(4)};
    margin: 0;
    line-height: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  ${props =>
    props.expandable &&
    `
    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.18);
    }
  `}
`

interface Props {
  expandable?: boolean
  final?: boolean
}

const Scoreboard = ({ expandable = true, final }: Props) => {
  const game = useSelector((state: AppState) => state.game)
  const [expanded, setExpanded] = useState(!expandable)

  if (!game || !game.teams[0] || !game.teams[1]) return <div />

  function handleClick() {
    if (expandable) {
      setExpanded(!expanded)
    }
  }

  return (
    <Container
      className="scoreboard"
      onClick={handleClick}
      onKeyDown={e => ifEnterOrSpace(e, handleClick)}
      role="button"
      tabIndex={0}
      expanded={expanded}
      expandable={expandable}
    >
      <div className="team">
        <h5>{game.teams[0].name}</h5>
        <h1>{game.teams[0].score}</h1>
        {(expanded || !expandable) && <PlayerList team={game.teams[0]} />}
      </div>
      <div className="round">
        {!final && <p>Round {game.turns[0].round}</p>}
        {final && <p>FINAL</p>}
        {expandable && <FontAwesomeIcon icon={['fas', 'angle-down']} />}
      </div>
      <div className="team">
        <h5>{game.teams[1].name}</h5>
        <h1>{game.teams[1].score}</h1>
        {(expanded || !expandable) && <PlayerList team={game.teams[1]} />}
      </div>
    </Container>
  )
}

export default Scoreboard
