import cypress from 'cypress';

describe('Тест конструктора бургера', () => {
  const categoryBunSelector = '[data-testid=category-buns]';
  const categoryMainSelector = '[data-testid=category-mains]';
  const categorySauceSelector = '[data-testid=category-sauces]';
  const modalsSelector = '[id=modals]';
  const buttonSelector = '[type=button]';
  beforeEach(() => {
    //Переход на главную страницу
    cy.visit('/');
    //Перехватываются запросы к API, возвращаются моковые данные.
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    //Подставляются моковые токены авторизации.
    cy.setCookie('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');
  });
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов в конструктор бургеров', () => {
    it('должен добавить булочки в конструктор бургеров', () => {
      //Ожидание загрузки ингредиентов
      cy.wait('@getIngredients');
      //Проверка наличия текста "Выберите булки"
      cy.contains('Выберите булки').should('exist');
      //Добавление булки в конструктор
      cy.get(categoryBunSelector).should('exist').contains('Добавить').click();
      //Проверка добавления булки в конструктор
      cy.get('.constructor-element_pos_top')
        .contains('Краторная булка N-200i')
        .should('exist');
    });

    it('должен добавить ингредиенты в конструктор для бургеров', () => {
      //Ожидание загрузки ингредиентов
      cy.wait('@getIngredients');
      //Проверка наличия текста "Выберите начинку"
      cy.contains('Выберите начинку').should('exist');
      //Добавление ингредиента в конструктор
      cy.get(categoryMainSelector).should('exist').contains('Добавить').click();
      //Проверка добавления ингредиента в конструктор
      cy.get('.constructor-element')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });

    it('должен добавить соусы в конструктор для бургеров', () => {
      //Ожидание загрузки ингредиентов
      cy.wait('@getIngredients');
      //Проверка наличия текста "Выберите начинку"
      cy.contains('Выберите начинку').should('exist');
      //Добавление соуса в конструктор
      cy.get(categorySauceSelector)
        .should('exist')
        .contains('Добавить')
        .click();
      //Проверка добавления соуса в конструктор
      cy.get('.constructor-element').contains('Соус Spicy-X').should('exist');
    });
  });

  describe('Тестирование работы модальных окон', () => {
    it('открытие/закрытие деталей ингредиента', () => {
      //Ожидание загрузки ингредиентов
      cy.wait('@getIngredients');
      //Открытие модального окна с деталями ингредиента
      cy.get(categoryBunSelector).should('exist').find('li').first().click();
      //Проверка открытия модального окна
      cy.get(modalsSelector)
        .contains('Краторная булка N-200i')
        .should('be.visible');
      //Закрытие модального окна
      cy.get(modalsSelector).find('button').click().should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('отображение пользователя в заголовке', () => {
      //Ожидание загрузки данных пользователя
      cy.wait('@getUser');
      //Проверка отображения имя пользователя в заголовке
      cy.get('header').contains('User Test').should('exist');
    });

    it('успешное создание заказа и очистка конструктора', () => {
      //Ожидание загрузки ингредиентов
      cy.wait('@getIngredients');
      //Добавление ингредиентов
      cy.get(categoryBunSelector).should('exist').contains('Добавить').click();
      cy.get(categoryMainSelector).contains('Добавить').click();
      cy.get(categoryMainSelector).contains('Добавить').click();
      cy.get(categorySauceSelector).contains('Добавить').click();
      //Нажатие кнопки "Оформить заказ"
      cy.get(buttonSelector).contains('Оформить заказ').click();
      //Ожидание успешного ответа от сервера
      cy.wait('@postOrder').its('response.statusCode').should('eq', 200);
      //Проверка открытия модального окна с номером заказа
      cy.get(modalsSelector).contains('123').should('be.visible');
      //Закрытие модального окна
      cy.get(modalsSelector).find('button').click().should('not.exist');
      //Проверка очистки конструктора после создания заказа
      cy.get('.constructor-element_pos_top').should('not.exist');
      cy.get('.constructor-element').should('not.exist');
    });
  });
});
