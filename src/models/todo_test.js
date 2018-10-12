import Todo from "./todo";
import QUnit from "steal-qunit";
import fixture from "can-fixture";

QUnit.module("Todo Model", function (hooks) {

    const noop = () => {};

    let todo1;

    hooks.beforeEach(() => {
        todo1 = new Todo({
            id: 1,
            task: "Initial Task 1"
        });
        todo1.on("_serialize", noop);
    });

    hooks.afterEach(() => {
        //If the next line is removed the test works fine
        todo1 && todo1.off("_serialize", noop);
        Todo.connection.deleteInstanceReference(todo1);
        todo1 = undefined;
    });

    QUnit.test("Test 1", assert => {
        const done = assert.async();

        fixture("GET /service/todos", [{
            id: 1,
            task: "Task 1"
        }]);

        Todo.getList().then(todos => {
            assert.equal(todo1.task, todos[0].task, "Task updated");
            assert.equal(todo1, todos[0], "Task updated");
            done();
        });
    });

    QUnit.test("Test 2", assert => {
        const done = assert.async();
        const ExpectedTodos = [{
            id: 1,
            task: "Task 1 Updated"
        }, {
            id: 2,
            task: "Task 2 Updated"
        }];

        fixture("GET /service/todos", ExpectedTodos);

        Todo.getList().then(todosResult => {
            assert.deepEqual(todosResult.serialize(), ExpectedTodos, "should be equal");
            done();
        });
    });
});