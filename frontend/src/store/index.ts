import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import user from './user/reducers'
import game from './game/reducers'
import loading from './loading/reducers'

const rootReducer = combineReducers({
  user,
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
