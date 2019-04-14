// requires ../observable/observable.js

const TodoController = () => {

    const Todo = () => {
        const textAttr = Observable("text");           // we current don't expose it as we don't use it elsewhere
        const doneAttr = Observable(false);
        return {
            getDone: ()   => doneAttr.getValue(),       // veneer method
            setDone: done => doneAttr.setValue(done),   // veneer method
            onDoneChanged:   doneAttr.onChange,         // veneer method
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
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

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);

        deleteButton.onclick    = _ => todoController.removeTodo(todo);

        todoController.onTodoRemove( removedTodo => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
        } );

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    }

    const statsUpdate = () => {
        numberOfTasksElement.innerText     = "" + todoController.numberOfTodos();
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();
    };

    todoController.onTodoAdd   (renderNewRow);
    todoController.onTodoAdd   (statsUpdate);
    todoController.onTodoRemove(statsUpdate);

    function newTodo() {
        const todo = todoController.addTodo();
        todo.onDoneChanged(statsUpdate);
    }

    return {
        newTodo: newTodo // to be called by UI, the only function that the view exposes
    }
};


