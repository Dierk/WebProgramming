
// todo: implement the times function


Number.prototype.times = function(fn) {

    return Array.from( {length:this}, (cur, index) => fn(index) )

};