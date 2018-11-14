
let todoContainerRef     = null;
let numberOfTasksRef     = 0;
let numberOfOpenTasksRef = 0;

function startTodo(startToDoContainer,
                   startNumberOfTasks,
                   startNumberOfOpenTasks) {
    todoContainerRef       = startToDoContainer;
    numberOfOpenTasksRef   = startNumberOfOpenTasks;
    numberOfTasksRef       = startNumberOfTasks
}

function addTodo() {

    const inputTD = document.createElement("TD");
    const input   = document.createElement("INPUT");
    inputTD.appendChild(input);

    const xTD = document.createElement("TD");
    xTD.innerText = "X";

    const okTD = document.createElement("TD");
    okTD.innerText = "OK";
    okTD.onclick = evt => {
        okTD.innerText = "Done";
        numberOfOpenTasksRef.innerText = Number(numberOfOpenTasksRef.innerText) - 1;
    };

    const tr = document.createElement("TR");

    tr.appendChild(inputTD);
    tr.appendChild(xTD);
    tr.appendChild(okTD);

    todoContainerRef.appendChild(tr);
    numberOfTasksRef.innerText     = Number(numberOfTasksRef.innerText) + 1;
    numberOfOpenTasksRef.innerText = Number(numberOfOpenTasksRef.innerText) + 1;
    
}
