import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorSlice from './slices/burgerConstructor-slice/burgerConstructor-slice';
import feedSlice from './slices/feed-slice/feed-slice';
import orderSlice from './slices/order-slice/order-slice';
import ingredientsSlice from './slices/ingredients-slice/ingredients-slice';
import userSlice from './slices/user-slice/user-slice';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorSlice,
  feed: feedSlice,
  ingredients: ingredientsSlice,
  order: orderSlice,
  user: userSlice
});

export default rootReducer;
