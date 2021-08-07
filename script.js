const todoInput = document.querySelector(".todo__input");
const todoBtn = document.querySelector(".todo__btn");
const todoList = document.querySelector(".todo__list");
const todoTemplate = document.getElementById("todo__template");

const LOCAL_STORAGE_KEY = "todo.list";

let todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
let todoAdded = false;

todoBtn.addEventListener("click", addTodo);

function createTodo(text) {
	return { text: text, complete: false };
}

function addTodo(event) {
	event.preventDefault();
	const todoValue = todoInput.value;
	if (todoValue == null || todoValue === "") return;

	const todo = createTodo(todoValue);
	todoAdded = true;
	todos.push(todo);
	save();
	render();

	todoInput.value = "";
}

function save() {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

function render() {
	clearElements(todoList);
	renderTodos();
}

function clearElements(element) {
	while (element.firstChild) {
		element.removeChild(element.lastChild);
	}
}

function renderTodos() {
	todos.forEach((todo, index) => {
		const newTodo = document.importNode(todoTemplate.content, true);

		const todoText = newTodo.querySelector(".todo__text");
		todoText.innerText = todo.text;

		const todoCheckbox = newTodo.querySelector("input");
		todoCheckbox.id = "todo-" + index;
		todoCheckbox.checked = todo.complete;

		const todoLabel = newTodo.querySelector("label");
		todoLabel.htmlFor = "todo-" + index;

		todoCheckbox.addEventListener("change", (event) => {
			todos[index].complete = !todos[index].complete;
			save();
		});

		const deleteBtn = newTodo.querySelector(".todo__delete");

		const todoLi = newTodo.querySelector(".todo");
		deleteBtn.addEventListener("click", () => {
			todoLi.classList.add("fade-out");
			todoLi.addEventListener("animationend", (event) => {
				if (event.animationName === "fadeOut") {
					todos.splice(index, 1);
					save();
					render();
				}
			});
		});

		if (todoAdded && index === todos.length - 1) {
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
