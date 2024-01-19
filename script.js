const todoLogo = document.querySelector('.todo__logo');
const listInput = document.querySelector('.lists__input');
const todoInput = document.querySelector('.todo__input');
const listBtn = document.querySelector('.lists__btn');
const todoBtn = document.querySelector('.todo__btn');
const upBtn = document.querySelector('.up-button');
const todoSelectedList = document.querySelector('.list__title');
const listDelete = document.querySelector('.list__delete');
const todoEmpty = document.querySelector('.todo__empty');
const listsEmpty = document.querySelector('.lists__empty');
const todoList = document.querySelector('.todo__list');
const todosList = document.querySelector('.lists__list');
const listTemplate = document.getElementById('list__template');
const todoTemplate = document.getElementById('todo__template');

const listHeading = document.querySelector('.list__heading');
const todoForm = document.querySelector('.todo__form');

const LOCAL_STORAGE_TODOS_KEY = 'todo.list';
const LOCAL_STORAGE_TODOS_LIST_ID_KEY = 'todo.list_id';

let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_TODOS_LIST_ID_KEY);
let todoAdded = false;

todoLogo.addEventListener('click', addTestData);
listBtn.addEventListener('click', addList);
todoBtn.addEventListener('click', addTodo);
upBtn.addEventListener('click', goToTop);
listDelete.addEventListener('click', () => {
	if (confirm('Are you sure you want to delete this list?')) {
		const index = todos.findIndex((list) => list.id === selectedListId);
		todos.splice(index, 1);
		if (todos.length > 0) {
			selectedListId = todos[0].id;
		}
		save();
		render();
	}
});

window.addEventListener('scroll', () => {
	if (window.scrollY > 0) {
		upBtn.classList.remove('fade-out');
		upBtn.classList.add('fade-in');
	} else {
		upBtn.classList.remove('fade-in');
		upBtn.classList.add('fade-out');
	}
});

function createList(name) {
	return { id: Date.now().toString(), name: name, todos: [] };
}

function createTodo(text) {
	return { text: text, complete: false };
}

function addTestData() {
	const data = [
		{
			id: Math.floor(Date.now().toString() * Math.random()).toString(),
			name: 'Yet',
			todos: [
				{ text: 'My', complete: false },
				{ text: 'First', complete: false },
				{ text: 'Todo', complete: false },
				{ text: 'App', complete: false },
			],
		},
		{
			id: Math.floor(Date.now().toString() * Math.random()).toString(),
			name: 'Another',
			todos: [
				{ text: 'First', complete: true },
				{ text: 'Second', complete: false },
				{ text: 'Third', complete: true },
				{ text: 'Fourth', complete: false },
				{ text: 'Fifth', complete: true },
			],
		},
		{
			id: Math.floor(Date.now().toString() * Math.random()).toString(),
			name: 'Todo',
			todos: [
				{ text: 'All', complete: true },
				{ text: 'Tasks', complete: true },
				{ text: 'Done', complete: true },
			],
		},
		{
			id: Math.floor(Date.now().toString() * Math.random()).toString(),
			name: 'App',
			todos: [],
		},
	];
	todos.push(...data);
	selectedListId = data[0].id;
	save();
	render();
}

function addList(event) {
	event.preventDefault();
	const listValue = listInput.value.trim();
	if (listValue == null || listValue === '') return;

	const list = createList(listValue);
	// todoAdded = true;
	todos.push(list);
	selectedListId = list.id;
	save();
	render();

	listInput.value = '';
}

function addTodo(event) {
	event.preventDefault();
	const todoValue = todoInput.value.trim();
	if (todoValue == null || todoValue === '') return;

	const todo = createTodo(todoValue);
	todoAdded = true;
	const selectedList = todos.find((list) => list.id === selectedListId);
	selectedList.todos.push(todo);
	save();
	render();

	todoInput.value = '';
}

function goToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

function save() {
	localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
	localStorage.setItem(LOCAL_STORAGE_TODOS_LIST_ID_KEY, selectedListId);
}

function render() {
	clearElements(todosList);

	renderLists();
	const selectedList = todos.find((list) => list.id === selectedListId);
	clearElements(todoList);
	if (selectedList != null) {
		renderTodos(selectedList);
	}
}

function clearElements(element) {
	while (element.firstChild) {
		element.removeChild(element.lastChild);
	}
}

function renderLists() {
	if (todos.length == 0) {
		listsEmpty.dataset.hidden = false;
		todoEmpty.dataset.hidden = true;
		listHeading.dataset.hidden = true;
		todoForm.dataset.hidden = true;
		return;
	}
	listsEmpty.dataset.hidden = true;
	listHeading.dataset.hidden = false;
	todoForm.dataset.hidden = false;

	todos.forEach((list) => {
		const newList = document.importNode(listTemplate.content, true);

		const listItem = newList.querySelector('.list');
		listItem.dataset.id = list.id;
		if (listItem.dataset.id === selectedListId) {
			listItem.classList.add('list--active');
		}

		const listName = newList.querySelector('.list__name');
		listName.innerHTML = list.name;

		const listCompletion = newList.querySelector('.list__completion');
		const completion = list.todos.filter(
			(todo) => todo.complete === true,
		).length;
		listCompletion.innerHTML = `${completion}/${list.todos.length}`;
		if (completion === list.todos.length) {
			listCompletion.classList.add('list__completion--completed');
		}

		listItem.addEventListener('click', (event) => {
			if (listItem.dataset.id != null) {
				selectedListId = listItem.dataset.id;
				save();
				render();
			}
		});

		todosList.appendChild(newList);
	});
}

function renderTodos(selectedList) {
	todoSelectedList.innerHTML = selectedList.name;
	if (todos.length > 0 && selectedList.todos.length == 0) {
		todoEmpty.dataset.hidden = false;
		return;
	}
	todoEmpty.dataset.hidden = true;

	selectedList.todos.forEach((todo, index) => {
		const newTodo = document.importNode(todoTemplate.content, true);

		const todoText = newTodo.querySelector('.todo__text');
		todoText.innerText = todo.text;

		const todoCheckbox = newTodo.querySelector('input');
		todoCheckbox.id = 'todo-' + index;
		todoCheckbox.checked = todo.complete;

		const todoLabel = newTodo.querySelector('label');
		todoLabel.htmlFor = 'todo-' + index;

		todoCheckbox.addEventListener('change', () => {
			selectedList.todos[index].complete = !selectedList.todos[index].complete;
			save();
			clearElements(todosList);
			renderLists();
		});

		const deleteBtn = newTodo.querySelector('.todo__delete');

		const todoLi = newTodo.querySelector('.todo');
		deleteBtn.addEventListener('click', () => {
			todoLi.classList.add('fade-out');
			todoLi.addEventListener('animationend', (event) => {
				if (event.animationName === 'fadeOut') {
					selectedList.todos.splice(index, 1);
					save();
					render();
				}
			});
		});

		if (todoAdded && index === selectedList.todos.length - 1) {
			todoLi.classList.add('fade-in');
			todoLi.addEventListener('animationend', (event) => {
				todoLi.classList.remove('fade-in');
			});
			todoAdded = false;
		}

		todoList.appendChild(newTodo);
	});
}

render();
