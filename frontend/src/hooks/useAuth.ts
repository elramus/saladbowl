import { useSelector } from 'react-redux'
import { AppState } from '../store'

export const useAuth = () => {
  const user = useSelector((state: AppState) => state.user)

  return user
}
