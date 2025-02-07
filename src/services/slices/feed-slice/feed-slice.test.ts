import feedSliceReducer, {
  getFeedThunk,
  feedInitialState,
  getOrdersThunk
} from './feed-slice';
import { TOrder } from '@utils-types';

jest.mock('../../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

describe('Проверка редьюсера слайса заказов', () => {
  describe('Проверка общего списка заказов', () => {
    it('ожидание получения общего списка заказов', () => {
      const state = feedSliceReducer(
        feedInitialState,
        getFeedThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('получение общего списка заказов', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            name: 'Mocked order',
            status: 'done',
            createdAt: '',
            updatedAt: '',
            number: 1,
            ingredients: []
          }
        ],
        total: 100,
        totalToday: 10
      };
      const state = feedSliceReducer(
        feedInitialState,
        getFeedThunk.fulfilled(payload, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(payload.orders);
      expect(state.total).toBe(payload.total);
      expect(state.totalToday).toBe(payload.totalToday);
      expect(state.error).toBeNull();
    });

    it('ошибка получения общего списка заказов', () => {
      const error = { message: 'Ошибка при загрузке списка заказов' };
      const state = feedSliceReducer(
        feedInitialState,
        getFeedThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке списка заказов');
    });
  });

  describe('Проверка получения списка заказов пользователя', () => {
    it('ожидание получения списка заказов пользователя', () => {
      const state = feedSliceReducer(
        feedInitialState,
        getOrdersThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('получение списка заказов пользователя', () => {
      const payload: TOrder[] = [
        {
          _id: '1',
          name: 'Mocked User Order',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          number: 2,
          ingredients: []
        }
      ];
      const state = feedSliceReducer(
        feedInitialState,
        getOrdersThunk.fulfilled(payload, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('ошибка получения списка заказов пользователя', () => {
      const error = { message: 'Ошибка при загрузке заказов пользователя' };
      const state = feedSliceReducer(
        feedInitialState,
        getOrdersThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке заказов пользователя');
    });
  });
});
