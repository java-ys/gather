import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import createRootReducer from './rootReducer'

export default function configureStore(preloadedState = {}) {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    createRootReducer(),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        thunk
      ),
    ),
  )

  return store
}
