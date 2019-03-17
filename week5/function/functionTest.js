// requires function.js

// IIFE
( function() {
    let x = true;
    document.writeln(x);
})();

try { // test x is not in scope
    x;
    document.writeln(false)
} catch (e) {
    document.writeln(true)
}


document.writeln( hasNoReturn(1)    === undefined);
document.writeln( hasReturn(1)      === 1);

document.writeln( lambdaFun1(1)     === 1);
document.writeln( lambdaFun2(1,1)   === 2);
document.writeln( lambdaFun3(1)(1)  === 2);
document.writeln( lambdaFun4(1)(1)  === 2);
document.writeln( any(1)(1)         === 2);