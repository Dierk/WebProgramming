
// todo: make bad/naive implementation correct

// execute asynchronous tasks in strict sequence, aka "reactive stream", "flux architecture"
const Scheduler = () => {

    const tasks = [];
    function process() {

        if (tasks.length === 0) return;

        const task = tasks.pop();

        let wasOk = false;
        const ok = () => wasOk = true;

        task(ok);

        if (wasOk) {
            process()
        }

    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    return {
        add: add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};


// a dataflow abstraction that is not based on concurrency but on laziness

const DataFlowVariable = howto => {

    return () => {
        // todo: how do we cache the value ???

        // todo: how do we set the value ???

        // return value;
    }
};

