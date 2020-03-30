import React, { useRef, useState } from 'react'
import styled from 'styled-components/macro'
import useMountEffect from '../hooks/useMountEffect'
import useReturnKeyListener from '../hooks/useReturnKeyListener'

const Container = styled('div')`
  input {
    padding: 0.65em 1em;
    width: 100%;
  }
`

interface Props {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReturn?: () => void;
  focusOnMount?: boolean;
}

const TextInput = ({
  placeholder,
  value,
  onChange,
  onReturn,
  focusOnMount = false,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  function handleFocus() {
    setIsFocused(true)
  }

  function handleBlur() {
    setIsFocused(false)
  }

  useMountEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('focus', handleFocus)
      ref.current.addEventListener('blur', handleBlur)
      if (focusOnMount) ref.current.focus()
    }
    return () => {
      ref.current?.removeEventListener('focus', handleFocus)
      ref.current?.removeEventListener('blur', handleBlur)
    }
  })

  function handleReturn() {
    if (isFocused && onReturn) {
      onReturn()
    }
  }

  useReturnKeyListener(handleReturn)

  return (
    <Container className="text-input">
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Container>
  )
}

export default TextInput
