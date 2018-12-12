
// todo: make bad/naive implementation correct

// execute asynchronous tasks in strict sequence, aka "actor", used in the "flux architecture"
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;

        const task = tasks.pop();

        inProcess = true;
        new Promise( ok => {
            task(ok);
        } ).then ( _ => {
            inProcess = false;
            process();
        }) ;

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
    let value = undefined;
    return () => {
        if (value !== undefined) return value;
        value = howto();
        return value;
    }
};

