import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  burgerConstructorInitialState
} from './burgerConstructor-slice';
import { TConstructorIngredient } from '@utils-types';

describe('Проверка редьюсера слайса конструктора бургера', () => {
  const createIngredient = (id: string): TConstructorIngredient => ({
    id,
    _id: id,
    name: `ingredient-${id}`,
    type: 'main',
    price: 100,
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    image: '',
    image_large: '',
    image_mobile: ''
  });

  it('добавление ингредиента', () => {
    const initialState = burgerConstructorInitialState;
    const action = addIngredient(createIngredient('1'));
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.constructorItems.ingredients.length).toBe(1);
    expect(newState.constructorItems.ingredients[0].id).toBeDefined();
    expect(newState.constructorItems.ingredients[0].id).not.toBe('');
    expect(newState.constructorItems.ingredients[0]._id).toBe('1');
    expect(newState.constructorItems.ingredients[0].id).not.toBe('1');
  });

  it('удаление ингредиента', () => {
    const initialState = burgerConstructorInitialState;
    const action = removeIngredient({ id: '1' });
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  it('перемещение ингредиента вверх', () => {
    const initialState = {
      ...burgerConstructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [createIngredient('1'), createIngredient('2')]
      }
    };
    const action = moveIngredientUp(1);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.constructorItems.ingredients[0].id).toBe('2');
    expect(newState.constructorItems.ingredients[1].id).toBe('1');
  });

  it('перемещение ингредиента вниз', () => {
    const initialState = {
      ...burgerConstructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [createIngredient('1'), createIngredient('2')]
      }
    };
    const action = moveIngredientDown(0);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.constructorItems.ingredients[0].id).toBe('2');
    expect(newState.constructorItems.ingredients[1].id).toBe('1');
  });
});
