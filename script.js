// --- Отримуємо доступ до DOM-елементів ---
const todoListEl = document.getElementById('todo-list');
const totalCountEl = document.getElementById('total-count');
const incompleteCountEl = document.getElementById('incomplete-count');
const addTodoBtn = document.getElementById('add-todo-btn');

// --- Крок 2: Структура даних ---
// Використовуємо масив об'єктів для зберігання справ
let todos = [];

// --- Крок 3: Функція newTodo ---
function newTodo() {
    const taskText = prompt('Введіть нову справу:');
    
    // Перевіряємо, що користувач щось ввів
    if (taskText) {
        // Створюємо об'єкт нової справи
        const newTodo = {
            id: Date.now(), // Унікальний ID на основі часу
            text: taskText,
            completed: false // Нові справи за замовчуванням не зроблені
        };
        
        // Додаємо нову справу до нашого масиву
        todos.push(newTodo);
        
        // Виводимо в консоль для перевірки
        console.log('Оновлений список todos:', todos);
        
        // Оновлюємо UI (кроки 5 та 6)
        render();
        updateCounter();
    }
}

// Прив'язуємо функцію newTodo до кнопки
addTodoBtn.addEventListener('click', newTodo);

// --- Крок 4: Функція renderTodo ---
// Приймає один об'єкт справи і повертає HTML-рядок
function renderTodo(todo) {
    const isCompleted = todo.completed;
    
    // Атрибути для HTML
    const checkedAttribute = isCompleted ? 'checked' : '';
    // Додаємо клас, щоб CSS міг закреслити текст
    const labelClass = isCompleted ? 'class="completed"' : '';
    
    // data-id потрібен, щоб ми могли знайти елемент при видаленні чи зміні
    return `
        <li data-id="${todo.id}">
            <input type="checkbox" id="todo-${todo.id}" class="todo-check" ${checkedAttribute} data-id="${todo.id}">
            <label for="todo-${todo.id}" ${labelClass}>${todo.text}</label>
            <button class="delete-btn" data-id="${todo.id}">Видалити</button>
        </li>
    `;
}

// --- Крок 5: Функція render ---
// Рендерить весь список справ
function render() {
    // 1. Перетворюємо масив об'єктів todos на масив HTML-рядків
    const todoStrings = todos.map(renderTodo); // .map() викличе renderTodo для кожного елемента
    
    // 2. Об'єднуємо всі рядки в один великий HTML-рядок
    const html = todoStrings.join('');
    
    // 3. Вставляємо цей HTML у список (замінюючи старий вміст)
    todoListEl.innerHTML = html;
}

// --- Крок 6: Функція updateCounter ---
// Оновлює лічильники
function updateCounter() {
    // 1. Загальна кількість - це просто довжина масиву
    totalCountEl.textContent = todos.length;
    
    // 2. Кількість незроблених (використовуємо .filter)
    const incompleteTodos = todos.filter(todo => !todo.completed);
    incompleteCountEl.textContent = incompleteTodos.length;

    /*
    // Альтернатива з .reduce (якщо потрібно)
    const incompleteCount = todos.reduce((count, todo) => {
        return todo.completed ? count : count + 1;
    }, 0);
    incompleteCountEl.textContent = incompleteCount;
    */
}

// --- Крок 7: Функція deleteTodo ---
// Видаляє справу за її ID
function deleteTodo(id) {
    // Створюємо новий масив, в якому НЕМАЄ справи з переданим id
    todos = todos.filter(todo => todo.id !== id);
    
    // Оновлюємо UI
    render();
    updateCounter();
}

// --- Крок 8: Функція checkTodo ---
// Змінює статус справи (completed) за її ID
function checkTodo(id) {
    // Використовуємо .map() для створення нового масиву
    todos = todos.map(todo => {
        // Якщо це та справа, яку ми шукаємо...
        if (todo.id === id) {
            // ...повертаємо її копію зі зміненим статусом
            return {
                ...todo, // копіюємо всі старі властивості (text, id)
                completed: !todo.completed // "перевертаємо" (інвертуємо) статус
            };
        }
        // Інакше повертаємо справу без змін
        return todo;
    });
    
    // Оновлюємо UI (щоб з'явилось/зникло закреслення)
    render();
    updateCounter();
}

// --- Додаємо "делегування подій" ---
// Ми слухаємо кліки на всьому списку <ul>,
// щоб "ловити" кліки на динамічно створених кнопках
todoListEl.addEventListener('click', (event) => {
    // Отримуємо data-id з елемента, по якому клікнули
    const id = Number(event.target.dataset.id);
    
    // Якщо клікнули по кнопці видалення
    if (event.target.classList.contains('delete-btn')) {
        deleteTodo(id);
    }
    
    // Якщо клікнули по чекбоксу
    if (event.target.classList.contains('todo-check')) {
        checkTodo(id);
    }
});

// --- Ініціалізація програми ---
// Викликаємо функції при першому завантаженні сторінки,
// щоб лічильники показували "0", а не залишалися порожніми.
render();
updateCounter();