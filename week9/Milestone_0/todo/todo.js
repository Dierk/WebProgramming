
let todoContainer = null;
let numberOfTasks = null;
let openTasks = null;

function startTodo(newTodoContainer, newNumberOfTasks, newOpenTasks) {
    todoContainer = newTodoContainer;
    numberOfTasks = newNumberOfTasks;
    openTasks     = newOpenTasks;
}

function addTodo() {
    const tr = document.createElement('TR');

    const textTd = document.createElement('TD');
    const inputElement = document.createElement('INPUT');
    textTd.appendChild(inputElement);
    tr.appendChild(textTd);

    const doneTd = document.createElement('TD');
    doneTd.innerText = 'OK';
    doneTd.className = 'done';

    doneTd.onclick = _ => {
        doneTd.innerText = 'Done';
        openTasks.innerText = Number(openTasks.innerText) - 1;
    };

    tr.appendChild(doneTd);



    todoContainer.appendChild(tr);

    numberOfTasks.innerText = Number(numberOfTasks.innerText) + 1;
    openTasks.innerText     = Number(openTasks.innerText) + 1;



    
}
