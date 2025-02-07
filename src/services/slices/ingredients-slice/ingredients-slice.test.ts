import ingredientsSliceReducer, {
  ingredientsInitialState,
  getIngredientsThunk
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Проверка редьюсера слайса ингредиентов', () => {
  it('ожидание получения списка ингредиентов', () => {
    const state = ingredientsSliceReducer(
      ingredientsInitialState,
      getIngredientsThunk.pending('testId')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('получение списка ингредиентов', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'Mocked Ingredient',
        type: 'sauce',
        proteins: 2,
        fat: 30,
        carbohydrates: 25,
        calories: 350,
        price: 1000,
        image: 'image_url',
        image_mobile: 'image_mobile_url',
        image_large: 'image_large_url'
      }
    ];
    const state = ingredientsSliceReducer(
      ingredientsInitialState,
      getIngredientsThunk.fulfilled(payload, 'testId')
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it('ошибка получения списка ингредиентов', () => {
    const error = { message: 'Ошибка при загрузке списка ингредиентов' };
    const state = ingredientsSliceReducer(
      ingredientsInitialState,
      getIngredientsThunk.rejected(error as any, 'testId')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке списка ингредиентов');
  });
});
