import { useEffect, RefObject } from 'react'

function useOutsideClickDetector(
  containerRef: RefObject<HTMLElement>,
  handler: () => void,
) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const { target } = e
      if (
        target &&
        containerRef.current &&
        !containerRef.current.contains(target as Element)
      ) {
        handler()
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [containerRef, handler])
}

export default useOutsideClickDetector
