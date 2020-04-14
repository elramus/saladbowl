import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../store'
import BigArrow from './BigArrow'
import { next } from '../../store/game/actions'
import RoundInfo from './RoundInfo'

const Container = styled('div')`
  text-align: center;
  color: white;
  font-weight: 900;
  h4 {
    margin: 2em 0;
  }
  .big-arrow {
    margin-top: 2em;
  }
`

const GetReady = () => {
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const game = useSelector((state: AppState) => state.game)
  const dispatch = useDispatch()

  function handleArrow() {
    if (game && authedUser) {
      dispatch(next({
        gameId: game._id,
        userId: authedUser._id,
      }))
    }
  }

  if (!authedUser) return <div />

  return (
    <>
      <RoundInfo />
      <Container>
        <h3>You're up, {authedUser.name}!</h3>
        <h4>Hit the arrow or press SPACE when you're ready to begin.</h4>
        <BigArrow onClick={handleArrow} />
      </Container>
    </>
  )
}

export default GetReady
