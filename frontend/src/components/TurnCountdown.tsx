import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import RoundInfo from './arena/RoundInfo'
import { AppState } from '../store'

const Container = styled('div')`
  color: white;
`

const TurnCountdown = () => {
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const prompterId = useSelector((state: AppState) => state.game?.turns[0].userId)
  const prompter = useSelector((state: AppState) => state.game?.players.find((p) => p.user._id === prompterId))
  const [count, setCount] = useState(3)

  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(count - 1)
      }
    }, 1000)
  }, [count])

  if (!prompterId || !prompter || !authedUser) {
    return <div />
  }

  return (
    <Container>
      <RoundInfo />
      {authedUser._id === prompterId && (
        <h3>Your turn begins in...</h3>
      )}
      {prompterId !== authedUser._id && (
        <h3>{prompter.user.name}'s turn begins in...</h3>
      )}
      <h1>{count > 0 && count}</h1>
    </Container>
  )
}

export default TurnCountdown
