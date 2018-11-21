
let todoContainerRef      = null;

const numberOfTasksObs     = Observable(0);
const numberOfOpenTasksObs = Observable(0);


function startTodo(startToDoContainer,
                   startNumberOfTasks,
                   startNumberOfOpenTasks) {
    todoContainerRef       = startToDoContainer;

    numberOfTasksObs.onChange( newValue =>
        startNumberOfTasks.innerText = newValue
    );
    numberOfOpenTasksObs.onChange( newValue =>
        startNumberOfOpenTasks.innerText = newValue
    );

}

function addTodo() {

    const tr      = document.createElement("TR");
    const inputTD = document.createElement("TD");
    const input   = document.createElement("INPUT");
    inputTD.appendChild(input);

    const okTD = document.createElement("TD");
    okTD.innerText = "OK";
    okTD.onclick = evt => {
        okTD.innerText = "Done";
        numberOfOpenTasksObs.setValue( numberOfOpenTasksObs.getValue() - 1 );
        okTD.onclick = undefined;
    };

    const xTD = document.createElement("TD");
    xTD.innerText = "X";
    xTD.onclick = evt => {
        numberOfTasksObs.setValue( numberOfTasksObs.getValue() - 1 );
        if (okTD.innerText === "OK") { // an open task was deleted
            numberOfOpenTasksObs.setValue(Math.max(0, numberOfOpenTasksObs.getValue() - 1));
        }
        todoContainerRef.removeChild(tr);
    };

    tr.appendChild(inputTD);
    tr.appendChild(xTD);
    tr.appendChild(okTD);

    todoContainerRef.appendChild(tr);

    numberOfTasksObs.setValue(numberOfTasksObs.getValue() + 1);
    numberOfOpenTasksObs.setValue(numberOfOpenTasksObs.getValue() + 1);
    
}
