import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import { User } from '../../store/authed-user/types'
import Modal from '../Modal'
import TextButton from '../TextButton'

const Container = styled('div')`
  h3 {
    margin-bottom: 2em;
    color: ${(props) => props.theme.darkGreen};
  }
  ul {
    margin-bottom: 4em;
    li {
      font-weight:bold;
    }
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
      game.players.forEach((player) => !player.ready && list.push(player.user))
    }
    return list
  }, [game])

  return (
    <Modal onClose={() => changeReadyStatus(false)}>
      <Container>
        <h3>You're so ready!</h3>
        <p>Waiting on...</p>
        {waitingOnList.length > 0 && (
          <ul>
            {waitingOnList.map((u) => (
              <li key={u._id}>{u.name}</li>
            ))}
          </ul>
        )}
        <TextButton
          text="Actually, I'm Not Ready"
          leadingIcon={['fas', 'long-arrow-left']}
          onClick={() => changeReadyStatus(false)}
        />
      </Container>
    </Modal>
  )
}

export default ReadyModal
