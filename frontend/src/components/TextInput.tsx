import React, { useRef } from 'react'
import styled from 'styled-components'
import useMountEffect from '../hooks/useMountEffect'
import animateEntrance from '../lib/animateEntrance'

const Container = styled('div')`
  input {
    padding: 0.65em 1em;
    width: 100%;
  }
`
const MaxLengthWarning = styled('span')`
  display: block;
  margin-top: 0.25rem;
  text-align: right;
  color: ${({ theme }) => theme.orange};
  font-size: 0.75rem;
  font-weight: bold;
  ${animateEntrance('fadeSlideDown', 350)}
`

interface Props {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onReturn?: () => void
  focusOnMount?: boolean
  maxLength?: number
}

const TextInput: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
  onReturn,
  focusOnMount = false,
  maxLength,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null)

  useMountEffect(() => {
    if (ref.current) {
      if (focusOnMount) ref.current.focus()
    }
  })

  function handleKeyDown(key: string) {
    if (key === 'Enter' && onReturn) {
      onReturn()
    }
  }

  return (
    <Container className="text-input">
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={e => handleKeyDown(e.key)}
        maxLength={maxLength}
      />
      {!!maxLength && value.length / maxLength > 0.75 && (
        <MaxLengthWarning>
          {value.length}/{maxLength}
        </MaxLengthWarning>
      )}
    </Container>
  )
}

export default TextInput
