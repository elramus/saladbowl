import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import LobbyHeader from './LobbyHeader'
import LobbyTabs from './LobbyTabs'
import { AppState } from '../../store'
import ReadyModal from './ReadyModal'
import { playerReadyStatus } from '../../store/game/actions'
import useScrollToTop from '../../hooks/useScrollToTop'
import CreatorWelcomeModal from '../CreatorWelcomeModal'
import { getPlayerFromUserId } from '../../lib/getPlayerFromId'
import useGaPageview from '../../hooks/useGaPageview'

const Container = styled('div')`
  padding: 0 1em;
  max-width: 40em;
  margin: auto;
`

const Lobby = () => {
  useGaPageview()

  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.game)
  const user = useSelector((state: AppState) => state.user)

  const [shouldAskIfReady, setAskIfReady] = useState(false)
  const [showCreatorWelcome, setShowCreatorWelcome] = useState(() => {
    return game?.creatorId === user?._id
  })

  const isReady = useMemo(() => {
    if (game && user) {
      return getPlayerFromUserId({ userId: user._id, game }).readyToPlay
    }
    return false
  }, [game, user])

  const isPickingTeams = useMemo(() => {
    // If teams are present on game at this point, then we're picking our own teams.
    return !!game && game.teams.length > 0
  }, [game])

  useEffect(() => {
    // If you've entered a phrase and picked a team, we should ask if you're ready.
    // We'll only do this if we're manually picking teams though. If you're not picking
    // teams, then the "done adding phrases" button already accomplishes this.
    if (isPickingTeams && game && user) {
      const phraseReady = game.phrases.some(p => p.authorId === user._id)
      const teamReady = isPickingTeams
        ? game.teams.some(team => team.userIds.includes(user._id))
        : true

      const currentPlayer = getPlayerFromUserId({ userId: user._id, game })

      if (phraseReady && teamReady && !currentPlayer.readyToPlay) {
        setAskIfReady(true)
      }
    }
  }, [game, isPickingTeams, user])

  function changeReadyStatus(status: boolean) {
    // Tell the DB user changed status.
    if (game) {
      dispatch(playerReadyStatus({
        gameId: game._id,
        status,
      }))
    }
  }

  useScrollToTop()

  return (
    <Container>
      <LobbyHeader shouldAskIfReady={shouldAskIfReady} changeReadyStatus={changeReadyStatus} />
      <LobbyTabs
        isPickingTeams={isPickingTeams}
        changeReadyStatus={changeReadyStatus}
        setAskIfReady={setAskIfReady}
      />
      {showCreatorWelcome && (
        <CreatorWelcomeModal onClose={() => setShowCreatorWelcome(false)} />
      )}
      {isReady && (
        <ReadyModal changeReadyStatus={changeReadyStatus} />
      )}
    </Container>
  )
}

export default Lobby
