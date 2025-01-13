import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorSlice from './slices/burgerConstructor-slice';
import feedSlice from './slices/feed-slice';
import orderSlice from './slices/order-slice';
import ingredientsSlice from './slices/ingredients-slice';
import userSlice from './slices/user-slice';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorSlice,
  feed: feedSlice,
  ingredients: ingredientsSlice,
  order: orderSlice,
  user: userSlice
});

export default rootReducer;
