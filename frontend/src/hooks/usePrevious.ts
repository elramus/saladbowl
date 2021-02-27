import { useEffect, useRef } from 'react'

export const usePrevious = <V>(value: V) => {
  const ref = useRef<V>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
