import React from 'react'
import styled from 'styled-components'
import animateEntrance from '../../lib/animateEntrance'
import { usePlayerRole } from '../../hooks/usePlayerRole'
import { useCurrentTurn } from '../../hooks/useCurrentTurn'
import { useCurrentPrompter } from '../../hooks/useCurrentPrompter'

const Container = styled('div')`
  border-left: 6px solid ${props => props.theme.black};
  padding: 0.25rem 0 0.25rem 0.75rem;
  margin: 2rem 0 4rem 0;
  ${animateEntrance('fadeSlideRight', 250)}
  h5 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  h3 {
    margin-bottom: 1rem;
  }
`

const UpNext = () => {
  const currentPrompter = useCurrentPrompter()
  const role = usePlayerRole()
  const turn = useCurrentTurn()

  return (
    <Container>
      <h5>Up Next...</h5>
      {role === 'prompting' && (
        <>
          <h3>{turn.turnLength === 60 ? `You're up, ${currentPrompter.name}!` : `You're finishing your turn, ${currentPrompter.name}!`}</h3>
          {turn.round === 1 && (
            <p>
              Use any words OTHER than what's in the phrase to prompt your
              teammates.
            </p>
          )}
          {turn.round === 2 && (
            <p>
              Use ACTING and SOUND EFFECTS to prompt your teammates, but no
              words!
            </p>
          )}
          {turn.round === 3 && (
            <p>Use just ONE WORD to prompt your teammates. Nothing else!!</p>
          )}
        </>
      )}
      {role === 'guessing' && (
        <>
          <h3>
            {currentPrompter.name}{' '}
            {turn.turnLength === 60 ? 'will be prompting' : 'will finish their turn'} for your team.
          </h3>
          <p>Get ready to guess!!</p>
        </>
      )}
      {role === 'nothing' && (
        <>
          <h3>
            {currentPrompter.name}{' '}
            {turn.turnLength === 60 ? 'will be prompting' : 'will finish their turn'} for the other team.
          </h3>
          <p>Relax, refresh your drink.</p>
        </>
      )}
    </Container>
  )
}

export default UpNext
