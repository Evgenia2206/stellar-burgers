import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

export interface burgerConstructorState {
  isLoading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: burgerConstructorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrderThunk = createAsyncThunk(
  'burgerConstructor/sendOrder',
  (data: string[]) => orderBurgerApi(data)
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const uniqId = nanoid();
        return { payload: { ...ingredient, id: uniqId } };
      },
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient & { id: string }>
      ) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id != action.payload
        );
    },
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    setNullOrderModalData: (state) => {
      state.orderModalData = null;
    },
    moveIngredientDown: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload + 1]
      ] = [
        state.constructorItems.ingredients[action.payload + 1],
        state.constructorItems.ingredients[action.payload]
      ];
    },
    moveIngredientUp: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload - 1]
      ] = [
        state.constructorItems.ingredients[action.payload - 1],
        state.constructorItems.ingredients[action.payload]
      ];
    }
  },
  selectors: {
    getConstructorSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(sendOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export { initialState as burgerConstructorInitialState };
export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setNullOrderModalData,
  moveIngredientDown,
  moveIngredientUp
} = burgerConstructorSlice.actions;

export const { getConstructorSelector } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
