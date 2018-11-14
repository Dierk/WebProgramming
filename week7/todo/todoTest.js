// requires todo.js
// requires /util/test.js

test("todo-setup", assert => {
    // initially, I should have 0 tasks and 0 open tasks

    const todoContainer = document.createElement("TBODY");

    const numberOfOpenTasks = document.createElement("SPAN");
    numberOfOpenTasks.innerText = "0";

    const numberOfTasks = document.createElement("SPAN");
    numberOfTasks.innerText = "0";

    startTodo(todoContainer, numberOfTasks, numberOfOpenTasks);

    assert.true(! todoContainer.hasChildNodes());
    assert.is(numberOfOpenTasks.innerText, "0");
    assert.is(numberOfTasks.innerText, "0");

    // when I click on "add" I should have 1 task and 1 open task

    addTodo();

    assert.is(todoContainer.childNodes.length, 1);

    const firstTaskOkTD = todoContainer.childNodes[0].childNodes[2];

    assert.is(firstTaskOkTD.innerText, "OK");

    assert.is(numberOfOpenTasks.innerText, "1");
    assert.is(numberOfTasks.innerText, "1");

    // when I click "ok", the task should be marked "Done" and the number of open tasks must decrease

    firstTaskOkTD.click();

    assert.is(todoContainer.childNodes.length, 1);  // do not accidentally delete
    assert.is(firstTaskOkTD.innerText, "Done");     // new label
    assert.is(numberOfOpenTasks.innerText, "0");
    assert.is(numberOfTasks.innerText, "1");        // do not accidentally change

});
