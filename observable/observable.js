

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => listeners.push(callback),
        getValue: ()       => value,
        setValue: val      => {
            if (value === val) return;
            value = val;
            listeners.forEach(notify => notify(val));
        }
    }
};

const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add:   value => {
            list.push(value);
            addListeners.forEach(listener => listener(value));
        },
        del:   value => {
            // del value from list
            const index = list.indexOf(value);
            if (-1 === index) return;
            list.splice(index,1);
            delListeners.forEach(listener => listener(value));
        },
        count: ()    => list.length,
        countIf: pred => {}
    }
};
