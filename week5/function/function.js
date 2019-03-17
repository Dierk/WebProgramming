
function hasNoReturn(s) {
    s
}
function hasReturn(s) {
    return s;
}
function any(x) {
    return function (y) {
        return x + y;
    }
}

const lambdaFun1 = s => s;
const lambdaFun2 = (x,y) => x+y;
const lambdaFun3 = x => y => x+y ;
const lambdaFun4 = x => y => {
    return x+y ;
};