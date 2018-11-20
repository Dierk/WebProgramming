

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
