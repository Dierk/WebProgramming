
// todo: implement the times function


function timesFunction( callback ) {
    for(let i=0; i< this ; i++) {
        callback(i);
    }
}

Number.prototype.times = timesFunction;