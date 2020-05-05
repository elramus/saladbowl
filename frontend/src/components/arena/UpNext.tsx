import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import { getUserFromUserId } from '../../lib/getUserFromUserId'
import animateEntrance from '../../lib/animateEntrance'

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
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)

  if (!game || !user) throw new Error('game or user not found in UpNext')

  const role: 'prompting' | 'guessing' | 'nothing' = useMemo(() => {
    if (game.turns[0].userId === user._id) return 'prompting'
    const promptersTeam = game.teams.find(t => t.userIds.includes(game.turns[0].userId))
    if (promptersTeam?.userIds.includes(user._id)) return 'guessing'
    return 'nothing'
  }, [game.teams, game.turns, user._id])

  return (
    <Container>
      <h5>Up Next...</h5>
      {role === 'prompting' && (
        <>
          <h3>You're up, {user.name}!</h3>
          {game.turns[0].round === 1 && (
            <p>Use any words OTHER than what's in the phrase to prompt your teammates.</p>
          )}
          {game.turns[0].round === 2 && (
            <p>ACT OUT and use SOUND EFFECTS to prompt your teammates, but no words!</p>
          )}
          {game.turns[0].round === 3 && (
            <p>You get just ONE WORD to prompt your teammates. Nothing else!!</p>
          )}
        </>
      )}
      {role === 'guessing' && (
        <>
          <h3>{getUserFromUserId({ userId: game.turns[0].userId, game }).name} will be prompting for your team.</h3>
          <p>Put on your thinking fedora and ready to guess!</p>
        </>
      )}
      {role === 'nothing' && (
        <>
          <h3>{getUserFromUserId({ userId: game.turns[0].userId, game }).name} will be prompting for the other team.</h3>
          <p>Relax, refresh your drink.</p>
        </>
      )}
    </Container>
  )
}

export default UpNext
