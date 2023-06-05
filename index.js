window.onload = () => {
    tasks.forEach(item => item.state = "show");
    Task.render();
}

// Отмена отправки формы по умолчанию
let form = document.querySelector('.form');
form.addEventListener('submit', e => {
    e.preventDefault();
});

// Задания хранятся в localStorage
let tasks = [];
const getTasks = localStorage.getItem('tasks');
if (getTasks) {
    tasks = JSON.parse(getTasks);
}

// поиск элементов в дереве HTML
const input = document.getElementById('task'),
    createBtn = document.getElementById('create-task'),
    searchBtn = document.getElementById('search-task'),
    refresh = document.getElementById('refresh'),
    clearBtn = document.querySelector('.clear');


// класс создания объектов "Задание"
class Task {
  // отрисовка заданий
  static render() {
    const tasks_container = document.getElementById('tasks');
    let _tasks = '';
    tasks.forEach((task) => {
      _tasks += `                                         
                <div id='${task.id}' class="task__item ${
                  task.state === 'show'
                    ? 'mt-2 d-flex justify-content-between align-items-center'
                    : 'd-none'
                }">
                    <div class="task-name">
                        <p class="${
                          task.completed === 'true'
                            ? 'text-decoration-line-through'
                            : 'text-dark'
                        }" id="task__name">${task.name}</p>
                    </div>
                    <div class="action btns">
                        <button type="button" class="btn btn-sm btn-success is__completed" onclick="Task.complete('${
                          task.id
                        }')"><i class="fa-solid fa-circle-check"></i></button>
                        <button type="button" class="btn btn-sm btn-primary edit" onclick="Task.update('${
                          task.id
                        }')"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-sm btn-danger ms-1 delete" onclick="Task.delete('${
                          task.id
                        }')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
    });
    tasks.length === 0 || _tasks === ''
      ? clearBtn.classList.add('d-none')
      : clearBtn.classList.remove('d-none');
    tasks_container.innerHTML = _tasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // создание задания
  static create(task) {
    const randomID = Math.floor(Math.random() * 99999);
    tasks.push({ id: randomID, name: task, completed: 'false', state: 'show' });
    this.render();
  }

  // завершение задания
  static complete(ID) {
    tasks.forEach((item) => {
      if (`${item.id}` === ID) {
        if (item.completed === 'false') item.completed = 'true';
        else item.completed = 'false';
      }
    });
    this.render();
  }

  // редактировать задание
  static update(ID) {
    const item = tasks.filter((item) => item.id == ID )[0];
    const taskItem = document.getElementById(ID);
    if (taskItem) {
        taskItem.classList.add('editor');
        const taskEdit = taskItem.querySelector('.task-name');
        taskEdit.innerHTML = `
            <input type="text" id="task__input" class="form-control" value="${item.name}" placeholder="Редактировать" />
            <button type="button" class="btn btn-sm btn-primary saver">
                Редактировать
            </button>
        `;
        const actionBtns = taskItem.querySelector('.action');
        actionBtns.style.display = 'none';
        const saveEditTodo = taskItem.querySelector('.saver');
        const taskInput = taskItem.querySelector('#task__input');

        saveEditTodo.addEventListener('click', () => {
            item.name = taskInput.value;
            this.updateTasks(item.id, item.name);

        });

        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (taskInput.value === '') showError('.error', 'Поле не может быть пустым!');
                else saveEditTodo.click();
            }
        })
    }
  }

  static updateTasks(id, newValue) {
    tasks = tasks.map((item) => { 
        if (item.id == id) {
            return {
                ...item,
                name: newValue
            }
        } 
        return item;
    });
    this.render();
  }

  // удалить задание
  static delete(task) {
    tasks = tasks.filter((item) => `${item.id}` !== task);
    this.render();
  }

  // поиск задания
  static search(task) {
    tasks = tasks.filter((item) =>
      item.name.toLowerCase() === task
        ? (item.state = 'show')
        : (item.state = 'hide')
    );

    const checkTask = (element) =>
      element.name.toLowerCase() === `${task.toString()}`;
    if (tasks.some(checkTask) === false) {
      showError('.error', 'Todo, Does not Exists!');
      return clearBtn.classList.add('d-none');
    } else clearBtn.classList.remove('d-none');

    this.render();
  }
}


// Кнопка "Создать"
createBtn.addEventListener('click', (e) => {
    const input_value = input.value;
    if (input_value !== '') {
        input.value = '';
        Task.create(input_value);
    } else {
        showError('.error', 'Cannot Add Todo!');
    }
});

// Кнопка "Поиск"
searchBtn.addEventListener('click', e => {
    let task = input;
    let search_value = input.value;

    if (search_value != '') {
        task.style.border = '1px solid gray';
        input.value = '';
        Task.search(search_value.toLowerCase());
    } else {
        showError('.error', 'Search Field Cannot be Empty!');
        task.style.border = '1px solid red';
    }
});


// Keyboard Support Enter Key (To add a Task) and > Right Arrow (to Search)
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') createBtn.click();

    if (e.key === 'ArrowRight') searchBtn.click();
});


// Отработка ошибок
function showError(error_place, error_message) {
    const error_container = document.querySelector(error_place);
    if (error_container) {
        error_container.innerHTML = `
            <div class="alert alert-danger error" role="alert">
                ${error_message}
            </div>
        `;
        setTimeout(() => error_container.innerHTML = '', 3000);
    }
}

// Очистить всё
function clear() {
    tasks = [];
    Task.render();
}

clearBtn.addEventListener('click', clear);

// Обновить страницу
refresh.addEventListener('click', () => location.href = location.href);