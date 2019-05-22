import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import * as reducers from "./store/reducers";
import thunkMiddleware from 'redux-thunk'
import { routerReducer } from 'react-router-redux'
//import createSagaMiddleware from 'redux-saga'
//import rootSaga from './rootSaga'
//import { routerMiddleware } from 'react-router-redux'
//import { drizzleReducers } from 'drizzle'
//import { generateContractsInitialState } from 'drizzle'
//import drizzleOptions from './drizzleOptions'

const reducer = combineReducers({
  routing: routerReducer,
  ...reducers,
  //...drizzleReducers
})

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//const sagaMiddleware = createSagaMiddleware()


//const initialState = {
//  contracts: generateContractsInitialState(drizzleOptions)
//}

const store = createStore(
  reducer,
  //initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      //routingMiddleware,
      //sagaMiddleware
    )
  )
)

//sagaMiddleware.run(rootSaga)

export default store
