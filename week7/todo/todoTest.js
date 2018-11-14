// requires todo.js
// requires /util/test.js

test("todo-setup", assert => {
    // initially, I should have 0 tasks and 0 open tasks

    const todoContainer = document.createElement("TBODY");

    const numberOfOpenTasks = document.createElement("SPAN");
    numberOfOpenTasks.innerText = "0";

    const numberOfTasks = document.createElement("SPAN");
    numberOfTasks.innerText = "0";

    startTodo(todoContainer,numberOfTasks,numberOfOpenTasks);

    assert.true(! todoContainer.hasChildNodes());
    assert.is(numberOfOpenTasks.innerText, "0");
    assert.is(numberOfTasks.innerText, "0");

    // todo: when I click on "add" I should have 1 task and 1 open task

    addTodo();

    assert.is(todoContainer.childNodes.length, 1);
    assert.is(todoContainer.childNodes[0].childNodes[2].innerText, "OK");

    assert.is(numberOfOpenTasks.innerText, "1");
    assert.is(numberOfTasks.innerText, "1");

});
