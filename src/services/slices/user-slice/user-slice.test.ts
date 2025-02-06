import userSliceReducer, {
  userInitialState,
  clearUserError,
  checkUserStatus,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getUserThunk,
  UserState
} from './user-slice';
import { setCookie, deleteCookie } from '../../../utils/cookie';

const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
};

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage(),
    writable: true
  });
});

afterAll(() => {
  delete (global as any).localStorage;
});

describe('Проверка редьюсера слайса пользователя', () => {
  it('проверка сброса ошибки', () => {
    const stateWithError: UserState = {
      ...userInitialState,
      error: 'Ошибка'
    };
    const state = userSliceReducer(stateWithError, clearUserError());
    expect(state.error).toBeNull();
  });

  it('проверка статуса пользователя', () => {
    const isAuth: UserState = {
      ...userInitialState,
      isAuthChecked: true
    };
    const state = userSliceReducer(isAuth, checkUserStatus());
    expect(state.isAuthChecked).toBe(true);
  });

  describe('Проверка авторизации', () => {
    const mockLogin = {
      email: 'mail@test.com',
      password: '12345'
    };

    it('ожидание получения логина', () => {
      const state = userSliceReducer(
        userInitialState,
        loginUserThunk.pending('testId', mockLogin)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('получение логина', () => {
      const payload = {
        success: true,
        user: { name: 'User Test', email: 'mail@test.com' },
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      };

      const state = userSliceReducer(
        userInitialState,
        loginUserThunk.fulfilled(payload, 'testId', mockLogin)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(state.error).toBeNull();
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    it('ошибка получения логина', () => {
      const error = { message: 'Ошибка авторизации' };
      const args = { email: 'mail@test.com', password: 'password' };
      const state = userSliceReducer(
        userInitialState,
        loginUserThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('Проверка регистрации', () => {
    it('ожидание регистрации', () => {
      const args = {
        name: 'User Test',
        email: 'mail@test.com',
        password: '12345'
      };
      const state = userSliceReducer(
        userInitialState,
        registerUserThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешная регистрация', () => {
      const payload = {
        success: true,
        user: { name: 'User New', email: 'new@test.com' },
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken'
      };

      const args = {
        name: 'User New',
        email: 'new@test.com',
        password: '12345'
      };

      const state = userSliceReducer(
        userInitialState,
        registerUserThunk.fulfilled(payload, 'testId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(state.error).toBeNull();
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    it('ошибка регистрации', () => {
      const error = { message: 'Ошибка регистрации' };
      const args = {
        name: 'User New',
        email: 'new@test.com',
        password: '12345'
      };

      const state = userSliceReducer(
        userInitialState,
        registerUserThunk.rejected(error as any, 'testId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('Проверка выхода', () => {
    it('ожидание выхода', () => {
      const state = userSliceReducer(
        userInitialState,
        logoutUserThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешный выход', () => {
      const state = userSliceReducer(
        {
          ...userInitialState,
          user: { name: 'User Test', email: 'mail@test.com' },
          isAuthorized: true
        },
        logoutUserThunk.fulfilled({ success: true }, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBe(false);
      expect(state.error).toBeNull();
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('ошибка выхода', () => {
      const error = { message: 'Ошибка выхода из системы' };
      const state = userSliceReducer(
        userInitialState,
        logoutUserThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка выхода из системы');
    });
  });

  describe('Проверка обновления данных пользователя', () => {
    const args = {
      name: 'User Updated',
      email: 'updated@test.com'
    };

    it('ожидание обновления данных', () => {
      const state = userSliceReducer(
        userInitialState,
        updateUserThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обновление данных пользователя', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', email: 'updated@test.com' }
      };
      const state = userSliceReducer(
        userInitialState,
        updateUserThunk.fulfilled(payload, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.error).toBeNull();
    });

    it('ошибка обновления данных', () => {
      const error = { message: 'Ошибка обновления данных пользователя' };
      const state = userSliceReducer(
        userInitialState,
        updateUserThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка обновления данных пользователя');
    });
  });

  describe('Проверка запроса восстановления пароля', () => {
    const args = {
      name: 'User Updated',
      email: 'updated@test.com'
    };

    it('ожидание восстановления пароля', () => {
      const state = userSliceReducer(
        userInitialState,
        forgotPasswordThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('восстановление пароля', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', email: 'updated@test.com' }
      };
      const state = userSliceReducer(
        userInitialState,
        forgotPasswordThunk.fulfilled(payload, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('ошибка восстановления пароля', () => {
      const error = { message: 'Ошибка восстановления пароля' };
      const state = userSliceReducer(
        userInitialState,
        forgotPasswordThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка восстановления пароля');
    });
  });

  describe('Проверка запроса сброса пароля', () => {
    const args = {
      password: '12345',
      token: 'mockAccessToken'
    };

    it('ожидание сброса пароля', () => {
      const state = userSliceReducer(
        userInitialState,
        resetPasswordThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('сброс пароля', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', password: '12345' }
      };
      const state = userSliceReducer(
        userInitialState,
        resetPasswordThunk.fulfilled(payload, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('ошибка сброса пароля', () => {
      const error = { message: 'Ошибка сброса пароля' };
      const state = userSliceReducer(
        userInitialState,
        resetPasswordThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка сброса пароля');
    });
  });
  describe('Проверка получения данных пользователя', () => {
    it('ожидание получения данных', () => {
      const state = userSliceReducer(
        userInitialState,
        getUserThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('получение данных пользователя', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', email: 'updated@test.com' }
      };
      const state = userSliceReducer(
        userInitialState,
        getUserThunk.fulfilled(payload, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.error).toBeNull();
    });

    it('ошибка получения данных', () => {
      const error = { message: 'Ошибка получения данных пользователя' };
      const state = userSliceReducer(
        userInitialState,
        getUserThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка получения данных пользователя');
    });
  });
});
