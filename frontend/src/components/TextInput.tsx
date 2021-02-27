import React, { useRef } from 'react'
import styled from 'styled-components'
import useMountEffect from '../hooks/useMountEffect'

const Container = styled('div')`
  input {
    padding: 0.65em 1em;
    width: 100%;
  }
`

interface Props {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onReturn?: () => void
  focusOnMount?: boolean
}

const TextInput: React.FC<Props> = ({
  placeholder,
  value,
  onChange,
  onReturn,
  focusOnMount = false,
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
      />
    </Container>
  )
}

export default TextInput
