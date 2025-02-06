import orderSliceReducer, {
  orderInitialState,
  getOrderThunk
} from './order-slice';

jest.mock('../../../utils/burger-api', () => ({
  getOrderByNumberApi: jest.fn()
}));

describe('Проверка редьюсера слайса заказа', () => {
  it('ожидание получения заказа', () => {
    const state = orderSliceReducer(
      orderInitialState,
      getOrderThunk.pending('testId', 123)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('получение заказа', () => {
    const payload = {
      success: true,
      orders: [
        {
          _id: '1',
          name: 'Mocked Order',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          number: 123,
          ingredients: []
        }
      ]
    };

    const state = orderSliceReducer(
      orderInitialState,
      getOrderThunk.fulfilled(payload, 'testId', 123)
    );

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(payload.orders[0]);
    expect(state.error).toBeNull();
  });

  it('ошибка получения заказа', () => {
    const error = { message: 'Ошибка при загрузке заказа' };
    const state = orderSliceReducer(
      orderInitialState,
      getOrderThunk.rejected(error as any, 'testId', 123, false, false)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке заказа');
  });
});
