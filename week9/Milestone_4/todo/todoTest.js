// requires todo.js
// requires /util/test.js

// now, we could become much more fine-granular if we wanted

test("todo-crud", assert => {

    // setup
    todoContainer = document.createElement("div");
    numberOfTasks = document.createElement("span");
    numberOfTasks.innerText = '0';
    openTasks = document.createElement("span");
    openTasks.innerText = '0';

    const todoController = TodoController();

    TodoItemsView(todoController, todoContainer);
    TodoTotalView(todoController, numberOfTasks);
    TodoOpenView (todoController, openTasks);

    const elementsPerRow = 3;

    assert.equals(todoContainer.children.length, 0*elementsPerRow);
    assert.equals(numberOfTasks.innerText, '0');
    assert.equals(openTasks.innerText, '0');

    todoController.addTodo();

    assert.equals(todoContainer.children.length, 1*elementsPerRow);
    assert.equals(numberOfTasks.innerText, '1');
    assert.equals(openTasks.innerText, '1');

    todoController.addTodo();

    assert.equals(todoContainer.children.length, 2*elementsPerRow);
    assert.equals(numberOfTasks.innerText, '2');
    assert.equals(openTasks.innerText, '2');

    const firstCheckbox = todoContainer.querySelectorAll("input[type=checkbox]")[0];
    assert.equals(firstCheckbox.checked, false);

    firstCheckbox.click();

    assert.equals(firstCheckbox.checked, true);

    assert.equals(numberOfTasks.innerText, '2');
    assert.equals(openTasks.innerText, '1');

    // add a test for the deletion of a todo-item

    // delete a checked item

    const firstDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    firstDeleteBtn.click();

    assert.equals(numberOfTasks.innerText, '1');
    assert.equals(openTasks.innerText, '1');      // remains!

    // delete an unchecked item

    const secondDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    secondDeleteBtn.click();

    assert.equals(numberOfTasks.innerText, '0');
    assert.equals(openTasks.innerText, '0');      // changes

});