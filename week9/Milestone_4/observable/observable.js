

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const remove       = array => index => array.splice(index, 1);
    const listRemove   = remove(list);
    const delListenersRemove = remove(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            const i = list.indexOf(item);
            if (i >= 0) { listRemove(i) }
            const indexesToRemove = []; // we cannot remove directly or we would jump over the next
            const delRemoverAt = index => () => indexesToRemove.push(index);
            // as a 2nd argument to the listener callback, provide a function that removes the listener when called
            delListeners.forEach( (listener, index) => listener(item, delRemoverAt(index) ));
            indexesToRemove.forEach(delListenersRemove);
        },
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};
