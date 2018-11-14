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

    // when I click "X", the now closed task should be deleted and the number of tasks must decrease

    const firstTaskXTD = () => todoContainer.childNodes[0].childNodes[1];

    firstTaskXTD().click();

    assert.is(todoContainer.childNodes.length, 0);
    assert.is(numberOfOpenTasks.innerText, "0");    // must not decrease when removing closed tasks
    assert.is(numberOfTasks.innerText, "0");        // must decrease

    // when I delete an open task, the numbers of open tasks must decrease

    addTodo();

    assert.is(numberOfOpenTasks.innerText, "1");

    firstTaskXTD().click();

    assert.is(numberOfOpenTasks.innerText, "0");

});
