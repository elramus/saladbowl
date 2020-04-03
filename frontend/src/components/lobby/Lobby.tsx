import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { useSelector, useDispatch } from 'react-redux'
import LobbyHeader from './LobbyHeader'
import LobbyTabs from './LobbyTabs'
import { AppState } from '../../store'
import ReadyModal from './ReadyModal'
import { playerReadyStatus } from '../../store/game/actions'
import useScrollToTop from '../../hooks/useScrollToTop'

const Container = styled('div')`
  padding: 0 1em;
  max-width: 40em;
  margin: auto;
`

const Lobby = () => {
  const game = useSelector((state: AppState) => state.game)
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const [isReady, setIsReady] = useState(false)
  const [shouldAskIfReady, setAskIfReady] = useState(false)
  const dispatch = useDispatch()

  useScrollToTop()

  useEffect(() => {
    // Ready requirements: Picked a team.
    const team = game?.teams.find((t) => t.userIds.some((p) => p === authedUser?._id))
    if (team) setAskIfReady(true)
  }, [authedUser, game])

  function changeReadyStatus(status: boolean) {
    // Change internal status to show/hide the READY modal.
    setIsReady(status)
    // Tell the DB user changed status.
    if (game) {
      dispatch(playerReadyStatus({
        gameId: game._id,
        status,
      }))
    }
  }

  return (
    <Container>
      <LobbyHeader shouldAskIfReady={shouldAskIfReady} changeReadyStatus={changeReadyStatus} />
      <LobbyTabs />
      {isReady && (
        <ReadyModal changeReadyStatus={changeReadyStatus} />
      )}
    </Container>
  )
}

export default Lobby
