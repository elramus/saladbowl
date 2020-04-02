import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { useDispatch, useSelector } from 'react-redux'
import { HelperText } from './styled/HelperText'
import TextInput from './TextInput'
import TextButton from './TextButton'
import { logInUser, getLoggedInUser } from '../store/authed-user/actions'
import { AppState } from '../store'
import LogoHeader from './LogoHeader'

const Container = styled('div')`
  text-align: center;
  max-width: 20em;
  padding: 0 1em;
  margin: 0 auto 0 auto;
  .go-container {
    margin-top: 2em;
    text-align: right;
  }
`

const Login: React.FC = ({
  children,
}) => {
  const authedUser = useSelector((state: AppState) => state.authedUser)
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!authedUser) {
      dispatch(getLoggedInUser())
    }
  }, [authedUser, dispatch])

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function handleNameSubmit() {
    if (name.length) {
      dispatch(logInUser(name))
    }
  }

  return (
    <>
      {!authedUser && (
        <Container>
          <LogoHeader />
          <div style={{ marginBottom: '3em' }}>
            <HelperText>Speak friend, and enter.</HelperText>
          </div>
          <TextInput
            placeholder="Enter your name..."
            value={name}
            onChange={handleNameChange}
            onReturn={handleNameSubmit}
            focusOnMount
          />
          <div className="go-container">
            <TextButton
              text="Go"
              trailingIcon={['fas', 'long-arrow-right']}
              onClick={handleNameSubmit}
              variant="cta"
              disabled={name.length === 0}
            />
          </div>
        </Container>
      )}
      {authedUser && children}
    </>
  )
}

export default Login
