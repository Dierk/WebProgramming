
// todo: make bad/naive implementation correct

// execute asynchronous tasks in strict sequence, aka "reactive stream", "flux architecture"
const Scheduler = () => {
    let   inProcess = false;
    const tasks     = [];
    function process() {
        if (tasks.length === 0) return; // guard clause
        if (inProcess) return;

        inProcess = true;  // sperre setzen

        const task = tasks.pop();

        const prom = new Promise( (resolve, reject) => task(resolve));
        prom.then( _ => {
            inProcess = false;  // sperre zurücksetzen
            process();          // weitermachen
        });
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
    return () =>
        undefined !== value
        ? value
        : value = howto()
};

