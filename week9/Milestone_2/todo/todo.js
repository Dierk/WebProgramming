// requires ../observable/observable.js

const Todo = () => {
    const textAttr = Observable("text");
    const doneAttr = Observable(false);
    return {
        getDone:  ()   => doneAttr.getValue(),     // veneer method
        setDone:  done => doneAttr.setValue(done), // veneer method
        doneAttr: ()   => doneAttr,
    }
};

const model =  [] ;
let   todoContainer = null;
let   numberOfTasks = null;
let   openTasks     = null;


const statsUpdate = () => {
    numberOfTasks.innerText = ""+ model.length;
    openTasks.innerText     = ""+ model.reduce( (sum, item) => item.getDone() ? sum : sum + 1, 0);
};

function startTodo(newTodoContainer, newNumberOfTasks, newOpenTasks) {
    todoContainer = newTodoContainer;
    numberOfTasks = newNumberOfTasks;
    openTasks     = newOpenTasks;
}

function newRow(todoContainer, todo) {

    // create view for the new row

    let row  = document.createElement("TR");
    let text = document.createElement("TD");
    let inp  = document.createElement("INPUT");
    inp.value = "todo";
    text.appendChild(inp);
    row.appendChild(text);

    let del = document.createElement("TD");
    del.classList.add("del");
    del.innerText = "X";
    del.onclick = _ => {
            const i = model.indexOf(todo);
            if (i >= 0) { model.splice(i, 1) } // essentially "remove(item)"
            todoContainer.removeChild(row);
            statsUpdate();
        } ;
    row.appendChild(del);

    let done = document.createElement("TD");
    done.classList.add("done");
    done.innerText = "OK";
    done.onclick = _ => todo.setDone(true);
    row.appendChild(done);

    todoContainer.appendChild(row);

    todo.doneAttr().onChange( newVal => {
        done.innerText = newVal ? "Done" : "OK";
        done.onclick = null;
    });

}

function newTodo() { // to be called by UI
    const todo = Todo();
    todo.doneAttr().onChange( val => statsUpdate() );
    model.push(todo);
    statsUpdate();
    newRow(todoContainer, todo)
}