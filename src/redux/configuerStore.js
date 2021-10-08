import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import post from './post';

const middleware = [thunk];
const enhancer = applyMiddleware(...middleware);
const rootReducer = combineReducers({
  post,
});
const store = createStore(rootReducer, enhancer);

export default store;
