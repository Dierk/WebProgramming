// requires ../observable/observable.js

const ToDo = () => {
    const doneAttr = Observable(false);
    return {
        getDone: ()  => doneAttr.getValue(),     // optional, veneer method
        setDone: val => doneAttr.setValue(val),  // optional, veneer method
        done:    ()  => doneAttr
    }
};

let todoContainer = null;
let numberOfTasks = null;
let openTasks     = null;

function startTodo(newTodoContainer, newNumberOfTasks, newOpenTasks) {
    todoContainer = newTodoContainer;
    numberOfTasks = newNumberOfTasks;
    openTasks     = newOpenTasks;
}

function addTodo() {

    const todo = ToDo();

    todo.done().onChange( _ => openTasks.innerText = Number(openTasks.innerText) - 1);

    const tr = document.createElement('TR');

    const textTd       = document.createElement('TD');
    const inputElement = document.createElement('INPUT');
    textTd.appendChild(inputElement);
    tr.appendChild(textTd);

    const doneTd = document.createElement('TD');
    doneTd.innerText = 'OK';
    doneTd.className = 'done';
    doneTd.onclick = _ => todo.setDone(true);

    todo.done().onChange( _ => doneTd.innerText = 'Done');
    todo.done().onChange( _ => doneTd.onclick = null);

    tr.appendChild(doneTd);

    const delTd = document.createElement('TD');
    delTd.innerText = 'X';
    delTd.className = 'del';

    delTd.onclick = _ => {
        // todolist.remove(todo);
        tr.remove();
        if (null !== doneTd.onclick)  /* task is not done*/ {
            openTasks.innerText = Number(openTasks.innerText) - 1;
        }
        numberOfTasks.innerText = Number(numberOfTasks.innerText) - 1;
    };
    tr.appendChild(delTd);

    todoContainer.appendChild(tr);

    numberOfTasks.innerText = Number(numberOfTasks.innerText) + 1;
    openTasks.innerText     = Number(openTasks.innerText) + 1;

}
