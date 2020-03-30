import { useEffect } from 'react'

function useSpaceKeyListener(handler: () => void, stopProp = false) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.which === 32) {
      if (stopProp) e.stopPropagation()
      handler()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })
}

export default useSpaceKeyListener
