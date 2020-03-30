import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import authedUser from './authed-user/reducers'
import game from './game/reducers'
import users from './users/reducers'
import loading from './loading/reducers'

const rootReducer = combineReducers({
  authedUser,
  users,
  game,
  loading,
})
export type AppState = ReturnType<typeof rootReducer>;

const composeEnhancers = composeWithDevTools({
  trace: false,
})
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
    ),
  ),
)


export default store
