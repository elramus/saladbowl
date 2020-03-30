import { useEffect } from 'react'

function useEscKeyListener(handler: () => void, stopProp = false) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.which === 27) {
      if (stopProp) e.stopPropagation()
      handler()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })
}

export default useEscKeyListener
