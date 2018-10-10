// requires function.js

(() => {

    const ok = [];

// IIFE
    (function () {
        let x = true;
        ok.push(x);
    })();

    try { // test x is not in scope
        x;
        ok.push(false)
    } catch (e) {
        ok.push(true)
    }

    ok.push(hasNoReturn(1) === undefined);
    ok.push(hasReturn(1) === 1);

    ok.push(lambdaFun1(1) === 1);
    ok.push(lambdaFun2(1, 1) === 2);
    ok.push(lambdaFun3(1)(1) === 2);
    ok.push(lambdaFun4(1)(1) === 2);
    ok.push(any(1)(1) === 2);


    report(ok);

})();
