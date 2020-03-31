import { useLayoutEffect } from 'react'

const useScrollToTop = () => {
  useLayoutEffect(() => {
    // Scroll ya to the top.
    window.scrollTo(0, 0)
  }, [])
}

export default useScrollToTop
