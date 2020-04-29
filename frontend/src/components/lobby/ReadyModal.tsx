import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import { User } from '../../store/user/types'
import Modal from '../Modal'
import TextButton from '../TextButton'

const Container = styled('div')`
  h3 {
    margin-bottom: 2em;
    color: ${props => props.theme.darkGreen};
  }
  ul {
    margin-bottom: 4em;
    li {
      font-weight:bold;
    }
  }
  p {
    margin-bottom: 2em;
  }
`

interface Props {
  changeReadyStatus: (status: boolean) => void;
}

const ReadyModal = ({
  changeReadyStatus,
}: Props) => {
  const game = useSelector((state: AppState) => state.game)

  const waitingOnList = useMemo(() => {
    const list: User[] = []
    if (game) {
      game.players.forEach(player => !player.readyToPlay && list.push(player.user))
    }
    return list
  }, [game])

  const enoughPlayers = useMemo(() => {
    return game?.teams.every(t => t.userIds.length > 0)
  }, [game])

  return (
    <Modal onClose={() => changeReadyStatus(false)}>
      <Container>
        <h3>You're so ready!</h3>
        {!enoughPlayers && (
          <p>Hmm, there needs to be at least one player on each team to start the game.</p>
        )}
        {enoughPlayers && (
          <>
            <p>Waiting on...</p>
            {waitingOnList.length > 0 && (
              <ul>
                {waitingOnList.map((u, i) => {
                  if (i <= 4) {
                    return <li key={u._id}>{u.name}</li>
                  }
                  return false
                })}
                {waitingOnList.length - 4 > 0 && (
                  <li>...and {waitingOnList.length - 4} more</li>
                )}
              </ul>
            )}
          </>
        )}
        <TextButton
          text="Actually, I'm Not Ready"
          leadingIcon={['fas', 'long-arrow-left']}
          onClick={() => changeReadyStatus(false)}
          variant="simple"
        />
      </Container>
    </Modal>
  )
}

export default ReadyModal
