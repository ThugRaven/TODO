const listInput = document.querySelector(".list__input");
const todoInput = document.querySelector(".todo__input");
const listBtn = document.querySelector(".list__btn");
const todoBtn = document.querySelector(".todo__btn");
const todoSelectedList = document.querySelector(".todo__selected-list");
const todoList = document.querySelector(".todo__list");
const todosList = document.querySelector(".list__list");
const listTemplate = document.getElementById("list__template");
const todoTemplate = document.getElementById("todo__template");

const LOCAL_STORAGE_TODOS_KEY = "todo.list";
const LOCAL_STORAGE_TODOS_LIST_ID_KEY = "todo.list_id";

let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODOS_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_TODOS_LIST_ID_KEY);
let todoAdded = false;

listBtn.addEventListener("click", addList);
todoBtn.addEventListener("click", addTodo);

function createList(name) {
	return { id: Date.now().toString(), name: name, todos: [] };
}

function createTodo(text) {
	return { text: text, complete: false };
}

function addList(event) {
	event.preventDefault();
	const listValue = listInput.value;
	if (listValue == null || listValue === "") return;

	const list = createList(listValue);
	// todoAdded = true;
	todos.push(list);
	save();
	render();

	listInput.value = "";
}

function addTodo(event) {
	event.preventDefault();
	const todoValue = todoInput.value;
	if (todoValue == null || todoValue === "") return;

	const todo = createTodo(todoValue);
	todoAdded = true;
	const selectedList = todos.find((list) => list.id === selectedListId);
	selectedList.todos.push(todo);
	save();
	render();

	todoInput.value = "";
}

function save() {
	localStorage.setItem(LOCAL_STORAGE_TODOS_KEY, JSON.stringify(todos));
	localStorage.setItem(LOCAL_STORAGE_TODOS_LIST_ID_KEY, selectedListId);
}

function render() {
	clearElements(todosList);

	renderLists();
	const selectedList = todos.find((list) => list.id === selectedListId);

	if (selectedListId != null) {
		clearElements(todoList);
		renderTodos(selectedList);
	}
}

function clearElements(element) {
	while (element.firstChild) {
		element.removeChild(element.lastChild);
	}
}

function renderLists() {
	todos.forEach((list) => {
		const newList = document.importNode(listTemplate.content, true);

		const listItem = newList.querySelector(".list");
		listItem.dataset.id = list.id;
		listItem.innerHTML = `${
			list.todos.filter((todo) => todo.complete === true).length
		}/${list.todos.length} ${list.name}`;

		listItem.addEventListener("click", (event) => {
			if (event.target.dataset.id != null) {
				selectedListId = event.target.dataset.id;
				save();
				render();
			}
		});

		todosList.appendChild(newList);
	});
}

function renderTodos(selectedList) {
	todoSelectedList.innerHTML = selectedList.name;

	selectedList.todos.forEach((todo, index) => {
		const newTodo = document.importNode(todoTemplate.content, true);

		const todoText = newTodo.querySelector(".todo__text");
		todoText.innerText = todo.text;

		const todoCheckbox = newTodo.querySelector("input");
		todoCheckbox.id = "todo-" + index;
		todoCheckbox.checked = todo.complete;

		const todoLabel = newTodo.querySelector("label");
		todoLabel.htmlFor = "todo-" + index;

		todoCheckbox.addEventListener("change", () => {
			selectedList.todos[index].complete = !selectedList.todos[index].complete;
			save();
		});

		const deleteBtn = newTodo.querySelector(".todo__delete");

		const todoLi = newTodo.querySelector(".todo");
		deleteBtn.addEventListener("click", () => {
			todoLi.classList.add("fade-out");
			todoLi.addEventListener("animationend", (event) => {
				if (event.animationName === "fadeOut") {
					selectedList.todos.splice(index, 1);
					save();
					render();
				}
			});
		});

		if (todoAdded && index === selectedList.todos.length - 1) {
			todoLi.classList.add("fade-in");
			todoLi.addEventListener("animationend", (event) => {
				todoLi.classList.remove("fade-in");
			});
			todoAdded = false;
		}

		todoList.appendChild(newTodo);
	});
}

render();
