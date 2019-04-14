"use strict";

/**
 * Generic Types
 * @typedef {*} a
 */

/**
 * Constructor of an assert that is passed into the {@link test} function.
 * @returns {{equals: (function({a},{a}):undefined), getOk: (function(): Array<boolean>)}}
 * @constructor
 */

const Assert = () => {
    /** @type {Array<boolean>} */
    const ok = [];
    /**
     * A function that takes two arguments of the same type, checks them for equality and pushes the
     * result onto {@link ok}. Side effect only, no return value.
     * @param {a} actual
     * @param {a} expected
     */
    const equals = (actual, expected) => {
        const result = (actual === expected);
        if (! result) {
           console.error(`not equal! actual was '${actual}' but expected '${expected}'`);
        }
        ok.push(result);
    };
    return {
        getOk: () => ok,
        equals: equals,
    }
};


/**
 * providing a scope and name for a test callback that takes a value of type {@link Assert}
 * and side-effects the assert to capture the test results.
 * Then it creates the report for this assert.
 * @param {string} origin, the name to be reported as the origin of the reported tests
 * @param {function(Assert): *} callback
 */
const test = (origin, callback) => {
    const assert = Assert();          //    das ok anlegen
    callback(assert);                 //    das ok befüllen
    report(origin, assert.getOk());   //    report mit name und ok aufrufen
};


/**
 * report :: String, [Bool] -> DOM ()
 * Report reports the list of boolean checks
 * @param {string}      origin: where the reported tests come from
 * @param { [boolean] } ok:     list of applied checks
 */
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        document.writeln(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    document.writeln("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            document.writeln("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function bar(extend) {
    document.writeln("+" + "-".repeat(extend) + "+");
}

// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return str;
    }
    return " ".repeat(extend - len);
}