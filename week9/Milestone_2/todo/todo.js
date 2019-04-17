// requires ../observable/observable.js

const TodoController = () => {

    const Todo = () => {
        const textAttr = Observable("text");           // we current don't expose it as we don't use it elsewhere
        const doneAttr = Observable(false);
        return {
            getDone: ()   => doneAttr.getValue(),       // veneer method
            setDone: done => doneAttr.setValue(done),   // veneer method
            onDoneChanged:  doneAttr.onChange,          // veneer method
        }
    };

    const todoModel = []; // array of Todos, this state is private

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.push(newTodo);
        return newTodo;
    };

    const removeTodo = todo => {
        const i = todoModel.indexOf(todo);
        if (i >= 0) { todoModel.splice(i, 1) } // essentially "remove(item)"
    };

    return {
        numberOfTodos:      () => todoModel.length,
        numberOfopenTasks:  () => todoModel.reduce((sum, item) => item.getDone() ? sum : sum + 1, 0),
        addTodo:            addTodo,
        removeTodo:         removeTodo,
    }
};


// View-specific part

const TodoView = (rootElement, numberOfTasksElement, numberOfOpenTasksElement) => {

    const todoController = TodoController(); // this could be shared across multiple views

    function createElements() {
        const template = document.createElement('DIV'); // only for parsing
        template.innerHTML = `
            <button class="delete">&times;</button>
            <input type="text" size="42">
            <input type="checkbox">            
        `;
        return template.children;
    }

    function renderNewRow(todo) {

        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => {
            todo.setDone(checkboxElement.checked);
        };

        deleteButton.onclick = _ => {
            todoController.removeTodo(todo);
            statsUpdate();                          // not yet perfect as this mixes multiple aspects
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
        };

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    }

    const statsUpdate = () => {
        numberOfTasksElement.innerText     = "" + todoController.numberOfTodos();
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();
    };

    function newTodo() { // to be called by UI, the only function that the view exposes
        const todo = todoController.addTodo();
        todo.onDoneChanged(_ => statsUpdate());
        renderNewRow(todo);

        statsUpdate(); // not yet perfect as this should be lazy
    }

    return {
        newTodo: newTodo
    }

};


