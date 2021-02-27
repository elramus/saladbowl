import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { HelperText } from './styled/HelperText'
import TextInput from './TextInput'
import TextButton from './TextButton'
import { logInUser, getLoggedInUser } from '../store/user/actions'
import { AppState } from '../store'
import LogoHeader from './LogoHeader'

const Container = styled('div')`
  text-align: center;
  max-width: 24em;
  padding: 0 1em;
  margin: 0 auto 0 auto;
  .go-container {
    margin-top: 2em;
    text-align: right;
  }
`

const Login: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector((state: AppState) => state.user)

  const [name, setName] = useState('')

  useEffect(() => {
    if (!user) dispatch(getLoggedInUser())
  }, [user, dispatch])

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
      {!user && (
        <Container>
          <LogoHeader />
          <div style={{ marginBottom: '3em' }}>
            <HelperText>Welcome. What do you want to be called?</HelperText>
          </div>
          <TextInput
            placeholder="Enter your name, or something else..."
            value={name}
            onChange={handleNameChange}
            onReturn={handleNameSubmit}
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
      {user && children}
    </>
  )
}

export default Login
