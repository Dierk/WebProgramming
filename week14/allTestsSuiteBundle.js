// times utility

const timesFunction = function(callback) {
  if( isNaN(parseInt(Number(this.valueOf()))) ) {
    throw new TypeError("Object is not a valid number");
  }
  for (let i = 0; i < Number(this.valueOf()); i++) {
    callback(i);
  }
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;

// string utilities

// appends blanks to the right until the string is of size extend
// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

// appends blanks to the left until the string is of size extend
// padLeft :: String, Int -> String
function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return "";
    }
    return " ".repeat(extend - len);
}

// rock-solid data structures


// ----------- Data structures

const Pair =
    first  =>
    second =>
    Object.seal( selector  => selector (first) (second) ); // seal to disallow using functions as objects

const fst = arg_1 => arg_2 => arg_1;
const snd = arg_1 => arg_2 => arg_2;

const Tuple = n => {
    if (n < 1) throw new Error("Tuple must have first argument n > 0");

    return [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => values => values[idx] )
    ];
};

const nApply = n => f => n === 0 ? f : ( g => nApply (n-1) (f (g) ));  // a curried functions that eats so many arguments

const Choice = n => { // number of ctors
    if (n < 1) throw new Error("Choice must have first argument n > 0");

    return [
        ...Array.from( {length:n}, (it, idx) => ChoiceCtor (idx + 1) (n + 1) ([]) ), // first arg is the ctor state
        choice => nApply (n) (choice)                                                // takes n + 1 args and returns arg[0] (arg[1]) (arg[2]) ... (arg[n])

    ];
};

// private implementation details ---------------------

const TupleCtor = n => values => {
    if (n === 0 ) {                                             // we have curried all ctor args, now
        return Object.seal(selector => selector(values))        // return a function that waits for the selector
    }
    return value => {                                           // there are still values to be curried
        return TupleCtor (n - 1) ([...values, value])           // return the ctor for the remaining args
    }
};

const ChoiceCtor = position => n => choices => {
    if (n === 0 ) {                                                  // we have curried all ctor args, now
        return Object.seal(choices[position] (choices[0]) )          // we call the chosen function with the ctor argument
    }
    return choice => {                                                // there are still choices to be curried
        return ChoiceCtor (position) (n - 1) ([...choices, choice])   // return the ctor for the remaining args
    }
};

// church encoding of the lambda calculus in JavaScript

// function id(x) { return x; }, \x.x
const id = x => x;

// function application, beta reduction
// const beta = f => id(f);
// const beta = f => f;
// beta.toString = () => "beta";
const beta = f => x => f(x);

// M, const, first, id2, true
const konst = x => y => x;

const flip = f => x => y => f(y)(x);

// const flip = f => g => x => f(x)(g);  // f(x)(g(x)) // konst(g)(x) -> g
// const flip = f => g      => s(f)(konst(g));         // C = \fg.S(f)(Kg)
// const flip = f => g => x => s(f)(konst(g))(x);      // def of S
// const flip = f => g => x => f(x)(konst(g)(x));
// const flip = f => g => x => f(x)(g); // qed.

// Kite
// kite = x => y => y;
// kite = x => y => konst(id)(x)(y);
// const kite = konst(id);
// const kite = x => y => flip(konst)(x)(y);
const kite = flip(konst);

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));
// const cmp = f => g      => S(konst(f))(g);
// const cmp = f => g => x => S(konst(f))(g)(x);
// const cmp = f => g => x => (konst(f)(x))(g(x));
// const cmp = f => g => x => (f)(g(x));
// const cmp = f => g => x => f(g(x)); // qed.

//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);

// ---- boolean logic

const T   = konst;
const not = flip;
const F   = not(T);             //const F = kite;

const and = x => y => x(y)(x);
// const and = f => g => f(g)(f);
// const and = f => g => S(f)(konst(f))(g)  // \fg.Sf(Kf)g

// const or  = x => y => x(x)(y);
const or  = x =>  x(x);
// const or  = M;

const beq = x => y => x(y)(not(y));
//const beq = x => y => S(x)(not)(y);
//const beq = x => S(x)(not);   // S(x)(K)

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;

//const imp = x => y => x (y) (T);
//const imp = x => y => x (y) ( not(x));
// const imp = x => y => flip(x) (not(x)) (y) ;
const imp = x => flip(x) (not(x)) ;
// const imp = S(not)(not) ;
//const imp = S(C)(C) ;


// ----

// loop = loop
// loop = (\x. x x) (\x. x x)
// loop = ( x => x(x) ) ( x => x(x) )
// this is self-application applied to self-application, i.e. M(M)
// which we already checked to be endlessly recursive

// rec = f => f (rec (f)) // cannot work, since rec(f) appears in argument position

// define loop in terms of rec:
// const rec = f => f (rec (f));  // y
// const rec = f => M ( x => f(M(x)) )     // s/o

// this works:
// rec :: (a -> a) -> a
const rec  = f => f ( n => rec(f)(n)  ) ;

// ---------- Numbers

const n0 = f => x => x;         // same as konst, F
const n1 = f => x => f(x);      // same as beta, once, lazy
const n2 = f => x => f(f(x));           // twice
const n3 = f => x => f(f(f(x)));        // thrice

//const succ = cn => ( f => x => f( cn(f)(x) ) );
//const succ = cn => ( f => x => f( (cn(f)) (x) ) );
//const succ = cn => ( f => x => cmp(f) (cn(f)) (x)  );
const succ = cn => ( f => cmp(f) (cn(f)) );
//const succ = cn => ( f => S(cmp)(cn)(f) );
//const succ = cn => S(B)(cn);

const n4 = succ(n3);
const n5 = succ(n4);

// addition + n is the nth successor

//const plus = cn1 => cn2 => f => x =>  cn2(succ)(cn1)(f)(x)  ; // eta
const plus = cn1 => cn2 =>  cn2(succ)(cn1)  ;

// multiplication is repeated plus
// const mult = cn1 => cn2 => cn2 (plus(cn1)) (n0) ;
// rolled out example 2 * 3
// const mult = cn1 => cn2 => f => x =>  f f f   f f f   x
// const mult = cn1 => cn2 => f => x =>  cn1 (cn2 (f))  (x); // eta
// const mult = cn1 => cn2 => f =>  cn1 (cn2 (f));  // introduce composition
// const mult = cn1 => cn2 => cmp(cn1)(cn2); // eta
// const mult = cn1 => cmp(cn1); // eta
const mult = cmp;
//const mult = B;

// power is repeated multiplication
// 2 ^ 3 = (2* (2* (2*(1))) ,
// const pow = cn1 => cn2 => cn2 (mult(cn1)) (n1);
// rolled out = f f ( f f ( f f x ))
// const pow = cn1 => cn2 => f => x => cn2 (cn1)(f)(x); // eta
const pow = cn1 => cn2 => cn2 (cn1) ;
// const pow = cn1 => cn2 => beta (cn2) (cn1) ;
// const pow = cn1 => cn2 => flip (beta) (cn1) (cn2) ;
// const pow = flip (beta) ;
// const pow = not(id);       // x^0 = 1

const isZero = cn =>  cn (konst(F)) (T);

const church = n => n === 0 ? n0 : succ(church(n-1)); // church numeral for n

// ----------- Data structures

// prototypical Product Type: pair
const pair = a => b => f => f(a)(b);

const fst$1 = p => p(T); // pick first  element from pair
const snd$1 = p => p(F); // pick second element from pair

// prototypical Sum Type: either

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = e => f => g => e (f) (g);

// maybe as a sum type

// const Nothing  = ()=> f => g => f ;        // f is used as a value
// const Just     = x => f => g => g (x);
// const maybe    = m => f => g => m (f) (g);

const Nothing  = Left() ;        // f is used as a value
const Just     = Right  ;
// const maybe    = either ;     // convenience: caller does not need to repeat "konst"
const maybe    = m => f => either (m) (konst(f)) ;

//    bindMaybe :: m a -> (a -> m b) -> mb
const bindMaybe = ma => f => maybe (ma) (ma) (f);

// ---- curry

// curry :: ((a,b)->c) -> a -> b -> c
const curry = f => x => y => f(x,y);

// uncurry :: ( a -> b -> c) -> ((a,b) -> c)
const uncurry = f => (x,y) => f(x)(y);

// The test "framework", exports the Suite function plus a total of how many assertions have been tested

let total = 0;

function Assert() {
    const results = []; // [Bool], true if test passed, false otherwise
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { console.error("test failed"); }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.error("test failure. Got '"+ actual +"', expected '" + expected +"'");
            }
            results.push(testResult);
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results);
}

function Suite(suiteName) {
    const tests = []; // [Test]
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            total += suiteAssert.results.length;
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report("suite " + suiteName, suiteAssert.results);
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( test => suite.test( test(name), test(logic) ) );
            }
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        write(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    write("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            write("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function write(message) {
    const out = document.getElementById('out');
    out.innerText += message + "\n";
}

function bar(extend) {
    write("+" + "-".repeat(extend) + "+");
}

const util = Suite("util-times");

// extending the prototype of many objects
util.add("num", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.add("str", assert => {

    const collect = [];

    '10'.times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.run();

const util$1 = Suite("util-strings");

// extending the prototype of many objects
util$1.add("padLeft", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(padLeft("a",2), " a");
    assert.is(padLeft("a",1), "a");
    assert.is(padLeft("a",0), "a");

});

util$1.run();

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
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item));
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};

const observable = Suite("observable");

observable.add("value", assert => {

    const obs = Observable("");

//  initial state
    assert.is(obs.getValue(),  "");

//  subscribers get notified
    let found;
    obs.onChange(val => found = val);
    obs.setValue("firstValue");
    assert.is(found,  "firstValue");

//  value is updated
    assert.is(obs.getValue(),  "firstValue");

//  it still works when the receiver symbols changes
    const newRef = obs;
    newRef.setValue("secondValue");
    // listener updates correctly
    assert.is(found,  "secondValue");

//  Attributes are isolated, no "new" needed
    const secondAttribute = Observable("");

//  initial state
    assert.is(secondAttribute.getValue(),  "");

//  subscribers get notified
    let secondFound;
    secondAttribute.onChange(val => secondFound = val);
    secondAttribute.setValue("thirdValue");
    assert.is(found,  "secondValue");
    assert.is(secondFound,  "thirdValue");

//  value is updated
    assert.is(secondAttribute.getValue(),  "thirdValue");

});

observable.add("list", assert => {
    const raw  = [];
    const list = ObservableList( raw ); // decorator pattern

    assert.is(list.count(), 0);
    let addCount = 0;
    let delCount = 0;
    list.onAdd( item => addCount += item);
    list.add(1);
    assert.is(addCount, 1);
    assert.is(list.count(), 1);
    assert.is(raw.length, 1);

    list.onDel( item => delCount += item);
    list.del(1);
    assert.is(delCount, 1);
    assert.is(list.count(), 0);
    assert.is(raw.length, 0);

});

observable.run();

// the SKI combinators for the church encoding

// self-application, Mockingbird, \x.x x
const M = f => beta(f)(f);  // f(f)

// identity is SKK, S(konst)(konst)
// S(K)(K)(x) = konst(x)( konst(x) )
// S(K)(K)(x) =      (x)
// S(K)(K)(x) =    id(x)
// S(K)(K)    =    id          // qed


// ---- boolean logic

// const imp = S(C)(C) ;

// ----
// Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI

// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

// in a non-lazy language, we need the Z fixed-point combinator
// \f. (\x. f(\v.xxv)) (\x. f(\v.xxv))
// \f. M(\x. f(\v. Mxv))
const Z = f => M(x => f(v => M(x)(v) ));

// const mult = B;

const Th = f => g => g(f);  // Thrush combinator  Th \af.fa ; CI
  // Vireo  V \abf.fab

const churchSuite = Suite("church");


churchSuite.add("identity", assert => {

        // identity
        assert.is( id(0) , 0);
        assert.is( id(1) , 1);
        assert.is( id , id);    // JS has function identity
        assert.true( id == id);     // JS has function equality by string representation
        assert.true( "x => x" == id);

        // function equivalence
        const other = x => x;
        assert.true( "x => x" == other);

        const alpha = y => y;
        assert.true( alpha != id );  // JS has no alpha equivalence

        // in JS, a == b && a == c  does not imply b == c
        assert.true( id != other);
        assert.true( id.toString() == other.toString());

        assert.is( id(id) , id);

    }
);

churchSuite.add("mockingbird", assert => {

        assert.is( M(id) , id ); // id of id is id

        assert.is("x => f(x)" , M(beta).toString()); // ???
        // M(beta) == beta => beta(beta)(beta)
        // M(beta) == beta(beta)(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => beta => beta(beta)
        // M(beta) == beta(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => x => beta(x)
        // M(beta) == x => beta(x)           // eta reduction
        // M(beta) == beta                   // qed.
        const inc = x => x + 1;
        assert.is( M(beta)(inc)(0) , beta(inc)(0)); //extensional equality


        // when loaded as an async module, this code crashes Safari and does not produce a proper s/o error
        // You can uncomment to test with a synchronous bundle.
        // try {
        //     assert.is( M(M) , M );  // recursion until s/o
        //     assert.true( false );   // must not reach here
        // } catch (e) {
        //     assert.true(true) // maximum call size error expected
        // }
    }
);


churchSuite.add("kestrel", assert => {

        assert.is(konst(5)(1) , 5);
        assert.is(konst(5)(2) , 5);

        assert.is(konst(id)(0) , id);
        assert.is(konst(id)(0)(1) , 1); // id(1)

    }
);


churchSuite.add("kite", assert => {

        assert.is(kite(1)(5) , 5);
        assert.is(kite(2)(5) , 5);

    }
);

churchSuite.add("flip", assert => {

        const append = x => y => x + y;
        assert.is( append("x")("y") , "xy");
        assert.is( flip(append)("x")("y") , "yx");

        const backwards = flip(append);
        assert.is( backwards("x")("y") , "yx");

    }
);


churchSuite.add("boolean", assert => {
        let bool = x => x(true)(false); // only for easier testing
        let veq = x => y => bool(beq(x)(y)); // value equality

        assert.true(   bool(T) );   // sanity checks
        assert.true( ! bool(F) );
        assert.true(   veq(T)(T) );
        assert.true( ! veq(T)(F) );
        assert.true( ! veq(F)(T) );
        assert.true(   veq(F)(F) );

        assert.true( veq (not(T)) (F) );
        assert.true( veq (not(F)) (T) );

        assert.true( veq (T) (and(T)(T)) );
        assert.true( veq (F) (and(T)(F)) );
        assert.true( veq (F) (and(F)(T)) );
        assert.true( veq (F) (and(F)(F)) );

        assert.true( veq (T) (or(T)(T)) );
        assert.true( veq (T) (or(T)(F)) );
        assert.true( veq (T) (or(F)(T)) );
        assert.true( veq (F) (or(F)(F)) );

        assert.true( veq (F) (xor(T)(T)) );
        assert.true( veq (T) (xor(T)(F)) );
        assert.true( veq (T) (xor(F)(T)) );
        assert.true( veq (F) (xor(F)(F)) );

        assert.true( veq (T) (imp(T)(T)) );
        assert.true( veq (F) (imp(T)(F)) );
        assert.true( veq (T) (imp(F)(T)) );
        assert.true( veq (T) (imp(F)(F)) );

        // addition from numerals
        assert.true( veq (T) (isZero(n0)) );
        assert.true( veq (F) (isZero(n1)) );
        assert.true( veq (F) (isZero(n2)) );

    }
);


churchSuite.add("composition", assert => {

        const inc = x => x + 1;
        assert.is( cmp(inc)(inc)(0) , 2);

        const append = x => y => x + y;          // have an impl.
        const f2 = x => y => append(x)(y); // curried form for experiment
        const f1 = x =>      f2(x);
        const f0 =           f1;

        assert.is( f2("x")("y") , "xy");
        assert.is( f1("x")("y") , "xy");
        assert.is( f0("x")("y") , "xy");

        // explain currying sequence with paren nesting
        // const myappend = (x => (y => (append(x)) (y) ));

    }
);


churchSuite.add("recursion", assert => {

        assert.is( rec(konst(1))  , 1);
        assert.is( Z(konst(1))    , 1); // the same in terms of the Z combinator

        // hand-made recursion
        const triangle = n => n < 1 ? 0 : triangle(n-1) + n;
        assert.is( triangle(10) , 55);

        // tail recursion
        const triTail = acc => n => n < 1 ? acc : triTail(acc + n)(n-1);
        assert.is( triTail(0)(10) , 55);

        // triFun does not longer appear on the right-hand side of the recursion!
        const triFun = f => acc => n => n < 1 ? acc : f(acc + n)(n-1) ;
        assert.is( rec (triFun)(0)(10) , 55);
        assert.is( Z   (triFun)(0)(10) , 55); // the same in terms of the Z combinator
        assert.is( rec (f => acc => n => n < 1 ? acc : f(acc + n)(n-1)) (0)(10) , 55);

        // if even works with non-tail recursion
        assert.is( rec (f => n => n < 1 ? 0 : f(n-1) + n) (10) , 55);

        // ideas for more exercises:
        // count, sum, product, (evtl later on array: none, any, every)

    }
);


churchSuite.add("numbers", assert => {

        const inc = x => x + 1;
        const nval = cn => cn(inc)(0);

        assert.is( nval(n0) , 0 );
        assert.is( nval(n1) , 1 );
        assert.is( nval(n2) , 2 );
        assert.is( nval(n3) , 3 );

        assert.is( nval( succ(n3) ) , 4 );

        assert.is( nval(n4) , 4 );
        assert.is( nval(n5) , 5 );

        assert.is( nval( succ(succ(n3))) , 3 + 1 + 1 );
        assert.is( nval( plus(n3)(n2))   , 3 + 2 );

        assert.is( nval( plus(n2)(plus(n2)(n2)) )   , 2 + 2 + 2 );
        assert.is( nval( mult(n2)(n3) )             , 2 * 3 );
        assert.is( nval( mult(n2)(n3) )             , 2 * 3 );

        assert.is( nval( pow(n2)(n3) )              , 2 * 2 * 2); // 2^3
        assert.is( nval( pow(n2)(n0) )              , 1); // x^0
        assert.is( nval( pow(n2)(n1) )              , 2); // x^1
        assert.is( nval( pow(n0)(n2) )              , 0); // 0^x
        assert.is( nval( pow(n1)(n2) )              , 1); // 1^x

        assert.is( nval( pow(n0)(n0) )              , 1); // 0^0  // Ha !!!

        assert.true ( nval( church(42) ) === 42 );

        const sval = cn => cn(s => 'I' + s)('');
        assert.is( sval(church(10)) , 'IIIIIIIIII');

        const qval = cn => cn(n => cn(inc)(n))(0); // square by cont adding
        assert.is( qval(church(9)) , 81 );

        const aval = cn => cn(a => a.concat(a[a.length-1]+a[a.length-2]) ) ( [0,1] );
        assert.is( aval(church(10-2)).toString() , '0,1,1,2,3,5,8,13,21,34');  // fibonacci numbers

        const oval = cn => cn(o => ({acc:o.acc+o.i+1, i:o.i+1})  ) ( {acc:0, i:0} );
        assert.is( oval(church(10)).acc , 55);  // triangle numbers

        // Thrush can be used as a one-element closure
        const closure = Th(1);  // closure is now "storing" the value until a function uses it
        assert.is( closure(id)  , 1 );
        assert.is( closure(inc) , 2 );

    }
);

churchSuite.add("pair", assert => {

        const p = pair(0)(1);      // constituent of a product type
        assert.is( fst$1(p)   , 0);  // p(konst) (pick first element of pair)
        assert.is( snd$1(p)   , 1);  // p(kite)  (pick second element of pair)

        const pval = cn => cn(p => pair(fst$1(p) + snd$1(p) + 1)(snd$1(p) + 1) ) ( pair(0)(0) );
        assert.is( fst$1(pval(church(10))) , 55);  // triangle numbers

    }
);

churchSuite.add("lazy", assert => {

        // when using church-boolean, either or maybe as control structures,
        // the branches must be lazy, or otherwise eager evaluation will call
        // both branches.

        let x = false;
        let y = false;
        T (x=true) (y=true);
        assert.true(x === true && y === true); // wrong: y should be false!

        // it does *not* help to defer execution via abstraction!
        x = false;
        y = false;
        T (konst(x=true)) (konst(y=true)) ();
        assert.true(x === true && y === true);// wrong: y should be false!

        // this doesn't work either
        x = false;
        y = false;
        const good = konst(x=true);
        const bad  = konst(y=true);
        T (good) (bad) ();
        assert.true(x === true && y === true);// wrong: y should be false!

        // literal definition of laziness works
        x = false;
        y = false;
        T (() => (x=true)) (() => (y=true)) ();
        assert.true(x === true && y === false);

        // this works
        x = false;
        y = false;
        function good2() {x=true;}
        function bad2()  {y=true;}
        T (good2) (bad2) ();
        assert.true(x === true && y === false);

        // and this works
        x = false;
        y = false;
        const good3 = () => x=true;
        const bad3  = () => y=true;
        T (good3) (bad3) ();
        assert.true(x === true && y === false);

    }
);

churchSuite.add("either", assert => {

        const left = Left(true);   // constituent of a sum type
        assert.true( either (left) (id) (konst(false)) );  // left is true, right is false

        const right = Right(true);   // constituent of a sum type
        assert.true( either (right) (konst(false)) (id) );  // left is false, right is true

    }
);

churchSuite.add("maybe", assert => {

        const no = Nothing;
        assert.true( maybe (no) ( true ) (konst(false)) );  // test the nothing case

        const good = Just(true);
        assert.true( maybe (good) ( false ) (id) );  // test the just value

        const bound = bindMaybe(Just(false))( b => Right(not(b))); // bind with not
        assert.true( maybe (bound) ( false ) (id) );  // test the just value

    }
);

churchSuite.add("curry", assert => {

        function add2(x,y) { return x + y }
        const inc = curry(add2);
        assert.is( inc(1)(1) ,  2);
        assert.is( inc(5)(7) , 12);

        const add3 = uncurry(curry(add2));
        assert.is( add3(1,1) , 2 );

    }
);


churchSuite.run(); // go for the lazy eval as this will improve reporting later

const rock = Suite("rock");

rock.add("border", assert => {

     try {
         Tuple(-1);
         assert.true(false); // must not reach here
     } catch (expected) {
         assert.true(true);
     }

     try {
         Tuple(0);
         assert.true(false); // must not reach here
     } catch (expected) {
         assert.true(true);
     }
});

rock.add("pair", assert => {

     const dierk = Pair("Dierk")("König");
     const firstname = fst;
     const lastname  = snd;

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");

});

rock.add("tuple3", assert => {

     const [Person, firstname, lastname, age] = Tuple(3);

     const dierk = Person("Dierk")("König")(50);

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");
     assert.is(dierk(age),       50);

});

rock.add("choice", assert => {

    const [Cash, CreditCard, Transfer, match] = Choice(3); // generalized sum type

    const pay = payment => match(payment)                  // "pattern" match
        (() =>
             amount => 'pay ' + amount + ' cash')
        (({number, sec}) =>
             amount => 'pay ' + amount + ' with credit card ' + number + ' / ' + sec)
        (([from, to]) =>
             amount => 'pay ' + amount + ' by wire from ' + from + ' to ' + to);

    let payment = Cash();
    assert.is(pay(payment)(50), 'pay 50 cash');

    payment = CreditCard({number: '0000 1111 2222 3333', sec: '123'});
    assert.is(pay(payment)(50), 'pay 50 with credit card 0000 1111 2222 3333 / 123');

    payment = Transfer(['Account 1', 'Account 2']);
    assert.is(pay(payment)(50), 'pay 50 by wire from Account 1 to Account 2');

});

rock.run();

// monoid

// integers are a monoid with plus and 0
// integers are a monoid with times and 1
// strings are a monoid with concatenation and ""


// clocks are a monoid with +% size and size

// motivating example
const clock_neutral = 12;
const clock_op = clockx => clocky =>
    (clockx + clocky) > 12 ?
    (clockx + clocky)-12 :
    (clockx + clocky);

// extract (parameter), generalize
const clock = size => {
    const neutral = size;
    const op = cx => cy => ( cx + cy) > size ?
        op(0)(cx + cy - size) :
        cx + cy;
    return {
        neutral: neutral,
        op:      op
    }
};

const mod = modul => {
    const neutral = 0;
    const op = cx => cy => ( cx + cy) % modul;
    return {
        neutral: neutral,
        op:      op
    }
};

// generalized monoidal fold

const mfold = monoid => array =>
    array.reduce(
        (accu, item) => monoid.op(accu)(item) ,
        monoid.neutral);


// a usual function type over (a -> a) allows for monoidal composition

const a2aMonoid = a2a => {
    const apply   = x => a2a(x);
    const neutral = x => x; // id
    const op = f => g => x => f(g(x));
    return {
        apply:   apply,
        neutral: neutral,
        op:      op
    }
};

// generalizing mfold and map into foldmap

const foldMap = monoid => mapFn => array => mfold(monoid)(array.map(mapFn));

// for monoids, the mapFn is always its "apply"

const mfoldMap = monoid => array => foldMap(monoid)(m => m.apply)(array);

// ----------- functor laws:
// identity    : x.map(id) = x
// composition : x.map( cmp(f)(g) ) = cmp( x.map(f) )( x.map(g) )

const concept = Suite("concept");

concept.add("monoid", assert => {

    // right-neutral
    assert.is( clock_op( 1)(clock_neutral) ,  1 ); // for all numbers 1 .. clock_size
    assert.is( clock_op(12)(clock_neutral) , 12 ); // for all numbers 1 .. clock_size

    // left neutral
    assert.is( clock_op(clock_neutral)( 1) ,  1 ); // for all numbers 1 .. clock_size
    assert.is( clock_op(clock_neutral)(12) , 12 ); // for all numbers 1 .. clock_size

    const clock11 = clock(11);
    assert.is( clock11.op(1)(clock11.neutral) , 1 );
    assert.is( clock11.op(clock11.neutral)(1) , 1 );
    assert.is( clock11.op(11)(clock11.neutral) , 11 );
    assert.is( clock11.op(clock11.neutral)(11) , 11 );

    assert.is( clock11.op(clock11.neutral)(33) , 11 ); // overflow handling via recursion

    // associativity
    assert.is( clock11.op(clock11.op(9)(10))(11) ,  clock11.op(9)(clock11.op(10)(11)) );
});

concept.add("isbn-example", assert => { // validating an ISBN-10 number

    const base11    = [1,2,3,4,5,6,7,8,9,10];
    const gina_isbn = '1935182447';

    const gina_nums = Array.from(gina_isbn).map(Number);

    const products  = Array.from({length:10}, (_,i) => base11[i] * gina_nums[i]);

    const z11 = mod(11);
    const checksum = products.reduce((accu, item) => z11.op(accu)(item), z11.neutral);
    assert.is( checksum    , 0);

    const generalized = mfold(z11)(products);
    assert.is( generalized , 0);

    assert.is( mfold(mod(2))([2,4,6,8]) , 0);
});

concept.add("a2a-monoid", assert => { // a monoid for functions types (a -> a)

    const times2 = num => num * 2;   // num -> num
    const plus3  = num => num + 3;   // num -> num
    const square = num => num * num; // num -> num

    const tm = a2aMonoid(times2);
    const pm = a2aMonoid(plus3);
    const sm = a2aMonoid(square);

    assert.is( tm.op(tm.neutral)(tm.apply)(1) , tm.apply(1) ); // left id for all values like 1
    assert.is( tm.op(tm.apply)(tm.neutral)(1) , tm.apply(1) ); // right id for all values like 1

    // associativity for all values like 5
    assert.is( tm.op(tm.op(tm.apply)(pm.apply))(sm.apply)(5) ,   // ( (*2).(+3) ) . (**2) ) (5) == (( 5**2 +3)*2)
             tm.op(tm.apply)(tm.op(pm.apply)(sm.apply))(5) );    // (*2) . ( (+3) . (**2) ) (5) == (( 5**2 +3)*2)

    // we can instantly use the generalized monoidal fold!
    // const combined = mfold(tm)([tm.apply,pm.apply,sm.apply]);
    // const combined = mfold(tm)([tm,pm,sm].map(m => m.apply));
    // const combined = foldMap(tm)(m => m.apply)([tm,pm,sm]);
    const combined = mfoldMap(tm)([tm,pm,sm]);

    assert.is( combined(5) , ( 5 ** 2 + 3) * 2 );

    // also works with (c -> d) (b -> c) (a -> b) as long as the types line up

    const tn = a2aMonoid(Number);   // String -> num
    const ts = a2aMonoid(x => x.toString()); // num -> String
    const a2b = mfoldMap(tn)([ts, tm,pm,sm, tn]);

    assert.is( a2b('5') , '56');
});


concept.add("functor", assert => {

    const id     = x => x;

    // array equivalence with sanity check
    const aEq = a1 => a2 => a1.length === a2.length && Array.from(a1, (xa,i) => xa === a2[i]).reduce((a,b)=> a && b, true);
    assert.true(aEq([1,2,3])([1,2,3])) ;
    assert.is(aEq([1,2,3])([1,2,3,4]) , false) ;
    assert.is(aEq([1,2,3])([1,2,4])   , false );

    // Array functor

    assert.true( aEq([1,2,3].map(id))([1,2,3]));
});

concept.run();

// functions for a lazily generated data structure (iterator/stream)

const STOP = {}; // todo think of a better solution. (use a maybe or call back only when value is available)

// generalized iteration a la "revenge of the nerds", Paul Graham
const iterate = f => value =>
    () => {
        if (value === STOP) return STOP;
        const result = value;
        value = f(value);
        return result
    };

const take = soMany => iterable =>
    takeWhile ( e => soMany-- > 0) (iterable);

const takeWhile = predicate => iterable =>
    () => {
        let current = iterable();
        return predicate(current) ? current : STOP ;
    };

const drop = soMany => iterable =>
    dropWhile (e => soMany-- > 0) (iterable);

const cons = value => iterable => {
    let firstCall = true;
    return () => {
        if (firstCall) {
            firstCall = false;
            return value;
        } else {
            return iterable();
        }
    }
};

const dropWhile = predicate => iterable => {
    let current = iterable();
    while (STOP !== current && predicate(current)) current = iterable();
    return cons (current) (iterable)
};

const each = iterable => f => {
    let current = null;
    while (STOP !== (current = iterable())) {
        f (current);
    }
};

const toArray = iterable => {
    const result = [];
    each(iterable)( e => result.push(e));
    return result;
};

// recursive solution
const toIterable = array =>
    array.reduceRight( (accu, item) => cons (item) (accu), () => STOP);

// imperative solution, it might be needed to fall back to this if the recursive solution is too slow.
// const toIterable = array => {
//     let index = 0;
//     return (array.length < 1)
//            ? (() => STOP)
//            : iterate ( _ => (array.length > index) ? array[index++] : STOP ) (array[index++])
// };

const lazy = Suite("lazy");

lazy.add("iterate", assert => {
    const nums = iterate (x => x+1) (0);
    assert.is(nums() , 0);
    assert.is(nums() , 1);


    const evens = iterate (x => x+2) (0);
    assert.is(evens() , 0);
    assert.is(evens() , 2);
    assert.is(evens() , 4);
});

lazy.add("take", assert => {
    const nums  = iterate (x => x+1) (0);
    const three = take (3) (nums);
    assert.is(three() , 0);
    assert.is(three() , 1);
    assert.is(three() , 2);
    assert.is(three() , STOP);
});

lazy.add("drop", assert => {
    const nums  = iterate (x => x+1) (0);
    const three = drop (3) (nums);
    assert.is(three() , 3);
    assert.is(three() , 4);
});

lazy.add("each", assert => {
    const nums  = iterate (x => x+1) (0);
    const three = take (3) (nums);

    const result = [];
    each(three)( e => result.push(e) );
    assert.is( result[2]     , 2 ) ;
    assert.is( result.length , 3 ) ;
});

lazy.add("toArray", assert => {
    const nums  = iterate (x => x+1) (0);
    const three = take (3) (nums);
    assert.is( toArray(three).toString() , "0,1,2" ) ;
});

lazy.add("toIterable", assert => {
    assert.is( toArray(toIterable([])).toString()    , "" ) ;
    assert.is( toArray(toIterable([1])).toString()   , "1" ) ;
    assert.is( toArray(toIterable([1,2])).toString() , "1,2" ) ;
});

lazy.run();

const north = pair ( 0) (-1);
const east  = pair ( 1) ( 0);
const south = pair ( 0) ( 1);
const west  = pair (-1) ( 0);

let direction = north;

const clockwise = [north, east, south, west, north];
const countercw = [north, west, south, east, north];

const snake = [
    pair (10) (5),
    pair (10) (6),
    pair (10) (7),
    pair (10) (8),
];

let food = pair(15)(15);

const setFood = x => y => food = pair(x)(y);

const pairEq   = a => b => fst$1(a) === fst$1(b) && snd$1(a) === snd$1(b);

const pairPlus = a => b => pair (fst$1(a) + fst$1(b)) (snd$1(a) + snd$1(b));

const pairMap  = f => p => pair (f(fst$1(p))) (f(snd$1(p)));

function changeDirection(orientation) {
    const idx = orientation.indexOf(direction);
    direction = orientation[idx + 1];
}

function nextBoard() {
    const max     = 20;
    const oldHead = snake[0];

    const head = pairMap (inBounds (max)) (pairPlus (oldHead) (direction));

    if (pairEq(food)(head)) {  // have we found any food?
        setFood (pick()) (pick());
    } else {
        snake.pop(); // no food found => no growth despite new head => remove last element
    }

    snake.unshift(head); // put head at front of the list
}

const pick = () => Math.floor(Math.random() * 20);

const inBounds = max => x => {
    if (x < 0)   { return max - 1 }
    if (x > max) { return 0 }
    return x
};

const snakeSuite = Suite("snake");

snakeSuite.add("move", assert => {

//  before start, snake is in start position
    const val = pairEq(snake[0]) (pair (10) (5) );
    assert.true( val );

//  after one step, snake has moved up
    nextBoard();
    assert.true(pairEq(snake[0]) (pair (10) (4) ));

//  before eating food, snake is of size 4
    assert.is(snake.length , 4);

//  after eating food, snake has grown in size
    setFood (10) (3);
    nextBoard();
    assert.is(snake.length , 5);

//  current direction is north
    assert.is(direction , north);

//  when I go clockwise, I end up east
    changeDirection(clockwise);
    assert.is(direction , east);

//  going counterclockwise, we end up north again
    changeDirection(countercw);
    assert.is(direction , north);

});

snakeSuite.run();

const minX =  0;
const maxX =  6;
const minY = -1;
const maxY =  1;

const normalizeY = height => y => {
    let scaleFactor = height / (maxY - minY);
    return height - (y - minY) * scaleFactor;
};

const normalizeX = width => x => {
    let scaleFactor = width / (maxX - minX);
    return ( x - minX) * scaleFactor;
};

const plotter = Suite("plotter");

plotter.add("normalize", assert => {

    assert.is( normalizeY(100)(-1) , 100 ); // baseline
    assert.is( normalizeY(100)( 1) , 0 );   // scale to top

    assert.is( normalizeX(100)( 0) , 0 );   // left origin
    assert.is( normalizeX(100)( 6) , 100 ); // scale to right end
});

plotter.run();

const DataFlowVariable = howto => {
    let value = undefined;
    return () => {
        if (value !== undefined) { return value }
        value = howto();
        return value;
    }
};

// execute asynchronous tasks in strict sequence
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( (ok, reject) => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
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

const dataflow = Suite("dataflow");

dataflow.add("value", assert => {

    const z = DataFlowVariable(() => x() + y());    // z depends on x and y, which are set later...
    const x = DataFlowVariable(() => y());         // x depends on y, which is set later...
    const y = DataFlowVariable(() => 1);

    assert.is(z(), 2);
    assert.is(x(), 1);
    assert.is(y(), 1);

});

dataflow.add("cache", assert => { // value must be set at most once

    let counter = 0;
    const x = DataFlowVariable(() => {
        counter++;
        return 1;
    });

    assert.is(counter, 0);
    assert.is(x(), 1);
    assert.is(counter, 1);
    assert.is(x(), 1);
    assert.is(counter, 1);

});


dataflow.add("async", assert => { // promise must be set at most once

    let counter = 0;

    const x = DataFlowVariable( async () => await y() * 3);
    const y = DataFlowVariable(() => {
        counter++;
        return new Promise( ok => setTimeout(ok(3), 10))
    });

    x().then( val => assert.is(counter,1));
    x().then( val => assert.is(val,9));
    x().then( val => assert.is(counter,1)); // yes, again!
    assert.true(true); // check console

});



dataflow.add("scheduler", assert => {

    const result = [];

    const scheduler = Scheduler();
    scheduler.add(ok => {
        setTimeout(_ => {   // we wait before pushing
            result.push(1);
            ok();
        }, 100);
    });
    scheduler.add(ok => {   // we push "immediately"
        result.push(2);
        ok();
    });
    scheduler.addOk ( () => result.push(3)); // convenience

    scheduler.add(ok => {
        assert.is(result[0], 1); // sequence is still ensured
        assert.is(result[1], 2);
        assert.is(result[2], 3);
    });

    assert.true(true); // any assertion error will appear in the console, not in the report

});

dataflow.run();

const Formulae =  {
    A1: '$(B3) - $(B2)', B1: '1',              C1: '$(A1) + $(B1)',
    A2: '2',             B2: '2',              C2: '$(A2) + $(B2)',
    A3: '$(A1) + $(A2)', B3: '$(B1) + $(B2)',  C3: '$(C1) + $(C2)',
};

const DFVs = {}; // lazy cache for the backing data flow variables

const cols = ["A","B","C"];
const rows = ["1","2","3"];

function startExcel() {
    const dataContainer = document.getElementById('dataContainer');
    fillTable(dataContainer);
}

function fillTable(container) {
    rows.forEach( row => {
        let tr = document.createElement("TR");
        cols.forEach( col => {
            let td     = document.createElement("TD");
            let input  = document.createElement("INPUT");
            let cellid = "" + col + row;
            input.setAttribute("VALUE", Formulae[cellid]);
            input.setAttribute("ID", cellid);
            DFVs[cellid] = df(input);

            input.onchange = evt => {
                Formulae[cellid] = input.value;
                DFVs[cellid] = df(input);
                refresh();
            };
            input.onclick  = evt => input.value = Formulae[cellid] ;

            td.appendChild(input);
            tr.appendChild(td);
        });
        container.appendChild(tr);
    });
}

function refresh() {
    cols.forEach( col => {
        rows.forEach( row => {
            let cellid  = "" + col + row;
            let input   = document.getElementById(cellid);
            input.value = numValue(cellid);
        });
    });
}

// get the numerical value of an input element's value attribute
const numValue = cellID => DFVs[cellID]();

function df(input) {
    return DataFlowVariable ( () => {
        const formula = Formulae[input.id];
        const code = formula.replace(/\$\((.*?)\)/g, 'numValue("$1")'); // make '$' in the formula be the numValue function (mini-DSL)
        return Number( eval(code))
    } ) ;
}

// Note: module bundlers do not like the eval() method since they might rename symbols on the fly (e.g. 'n' to 'n$1' ) and
// cannot foresee how dynamically evaluated code might rely on the original name.
// Hence, we introduce a mini-dsl where '$' is a replacement for the 'numValue' function.

const excelSuite = Suite("excel");

excelSuite.add("normalize", assert => {

    let tbody = document.createElement("TBODY");
    tbody.setAttribute("ID","dataContainer");
    let body = document.getElementsByTagName("BODY")[0];
    body.appendChild(tbody);

    startExcel();
    refresh();
    assert.is(numValue('C3'), 6);

    body.removeChild(tbody);

});

excelSuite.run();

const object = Suite("object");

object.add("silly-scope", assert => {

    let that = {};
    function Person(first, last) {
        // was: this.firstname = first; // but when used from a module, we cannot use unitialized "this"; using outer "that" as a replacement if needed
        that = this || that;    // only as compensation for the module case (that) or non-module, bundled case (this)
        that.firstname = first;
        that.lastname  = last;
        that.getName   = function() { return this.firstname + " "  + this.lastname };
        return that;
    }

    // remember: calling a function retains the scope

    const good = Person("Good", "Boy");      // "accidentally" forgot the "new"
    assert.is( good.getName() , "Good Boy");

    const other = Person("Other", "Boy");
    assert.is(other.getName() , "Other Boy");
    assert.is(good.getName()  , "Other Boy"); // OOPS! We have accidentally overwritten the good boy.

    assert.is(false , good instanceof Person); // they do not share the prototype

    const good2 = new Person("Good", "Boy"); // one way or the other we have to create a "new" object!
    assert.is( good2.getName() , "Good Boy");

    const other2 = new Person("Other", "Boy");
    assert.is(other2.getName() , "Other Boy");
    assert.is(good2.getName()  , "Good Boy"); // retained

    assert.true(good2 instanceof Person);   // now they do
});

// Using object literals as a replacement for functions
// is super dynamic, keeps "methods" close to their data,
// but doesn't allow for sharing of structure.
// (unless advanced use with Object.create)
// Also: use of "this" can lead to surprises.

object.add("literal", assert => {

    const good = {
        firstname : "Good",
        lastname  : "Boy",
        // must use "this" or type error
        getName   : function() { return this.firstname + " "  + this.lastname }
    };

    assert.is(good.getName() , "Good Boy");

    // share object instance
    const other = good;
    assert.is(good.getName() , "Good Boy");

    // change value
    other.firstname = "Other";
    assert.is(other.getName() , "Other Boy");
    assert.is(good.getName()  , "Other Boy");

    const store = {
        accessor : good.getName  // when we store a reference elsewhere
    };
    assert.is(store.accessor()  , "undefined undefined"); // OOPS!
});

// Variant that doesn't need to be called with "new"
// since a new object is created with ever "ctor" call.

object.add("self-new", assert => {

    function OpenPerson(first, last) {
        return {
            firstname : first,
            lastname  : last,
            // must use "this" or type error
            getName   : function() { return this.firstname + " "  + this.lastname }
        }
    }

    const good = OpenPerson("Good", "Boy");
    assert.is(good.getName() , "Good Boy");

    // share object instance
    const other = good;
    assert.is(good.getName() , "Good Boy");

    // change value
    other.firstname = "Other";
    assert.is(other.getName() , "Other Boy");
    assert.is(good.getName()  , "Other Boy");
});

// A safe version that makes use of the fact that closure
// scope is safe from manipulation.
// Needs no "this"!
// Trying to change the state fails silently.

object.add("failed", assert => {

    function Person(first, last) {
        let firstname = first;
        let lastname  = last;
        return {
            // cannot use "this" as it is undefined
            getName   : function() { return firstname + " "  + lastname }
        }
    }

    const good = Person("Good", "Boy");
    assert.is(good.getName() , "Good Boy");

    // change value (failed attempt)
    good.firstname = "Bad";
    assert.is(good.firstname , "Bad");      // a new value has been set, but it is not used, Object.seal() prevents this
    assert.is(good.getName() , "Good Boy"); // change silently swallowed, expected: "Bad Boy"
});

// A safe version that makes use of the fact that closure
// scope is safe from manipulation.
// Needs no "this"!
// Creates no "type".

object.add("distinct", assert => {

    function Person(first, last) {
        let firstname = first;      // optional, see distinct2
        let lastname  = last;
        return {
            getName   : function() { return firstname + " "  + lastname }
        }
    }

    const good = Person("Good", "Boy");
    const bad  = Person("Bad", "Boy");     // distinct new instance

    assert.is(good.getName() , "Good Boy");
    assert.is(bad.getName()  , "Bad Boy" );

    good.getName = () => "changed";
    assert.is(good.getName() , "changed");  // change one instance doesn't change the other
    assert.is(bad.getName()  , "Bad Boy" );

    assert.true(! Person.prototype.isPrototypeOf(good)); // they do not even share the same prototype
    assert.true(! Person.prototype.isPrototypeOf(bad));

    assert.is(false , good instanceof Person); // good is not a Person!
    assert.is("object" , typeof good );
});

// Version of "distinct" that makes use of the closure scope for arguments
object.add("distinct2", assert => {
    function Person(first, last) { // closure scope for arguments
        return {
            getName   : function() { return first + " "  + last }
        }
    }

    const good = Person("Good", "Boy");
    const bad  = Person("Bad", "Boy");     // distinct new instance

    assert.is(good.getName() , "Good Boy");
    assert.is(bad.getName()  , "Bad Boy" );

    good.getName = () => "changed";
    assert.is(good.getName() , "changed");  // change one instance doesn't change the other
    assert.is(bad.getName()  , "Bad Boy" );

    assert.true(! Person.prototype.isPrototypeOf(good)); // they do not even share the same prototype
    assert.true(! Person.prototype.isPrototypeOf(bad));

    assert.is(false , good instanceof Person); // good is not a Person!
    assert.is("object" , typeof good );
});

// Standard Typescript way of creating objects (unless with => syntax)
// Still dynamic: instance and "class" (prototype) can change at runtime.
object.add("prototype", assert => {
    const Person = ( () => {                // lexical scope for construction
        function Person(first, last) {      // constructor, setting up the binding
            this.firstname = first;
            this.lastname  = last;
        }
        Person.prototype.getName = function() {  // functions are shared through the prototype // "=>" not allowed!
            return this.firstname + " " + this.lastname;
        };
        return Person;
    }) (); // IIFE

    const good = new Person("Good", "Boy");    // now it requires "new"
    const bad  = new Person("Bad", "Boy");     // distinct new instance

    assert.is(good.getName() , "Good Boy");    // without "new" it throws TypeError
    assert.is(bad.getName()  , "Bad Boy" );

    assert.is(good.firstname , "Good");        // the function scope is still accessible for manipulation

    good.getName = () => "changed";
    assert.is(good.getName() , "changed");  // one can still change a single instance
    assert.is(bad.getName()  , "Bad Boy" );

    assert.true(Person.prototype.isPrototypeOf(good)); // Now they share the same prototype
    assert.true(Person.prototype.isPrototypeOf(bad));

    // new functions get shared
    Person.prototype.secret = () => "top secret!";
    assert.is(good.secret() , "top secret!");
    assert.is(bad.secret()  , "top secret!");

    assert.is(good instanceof Person   , true);
    assert.is(good instanceof Function , false); // why this ???
    assert.is(good instanceof Object   , true);
});

object.run();

// "hand-made" object abstraction

const Player = (name) => {   // note that name is immutable!
    let fallbackIndex = 0;   // local function scope is safe
    let progressIndex = 0;
    return {
        getFallbackIndex: () => fallbackIndex,
        getProgressIndex: () => progressIndex,
        proceed:      stride => progressIndex += stride,
        fallback:         () => progressIndex = fallbackIndex,
        turn:             () => fallbackIndex = progressIndex
    }
};

const oopsie = Suite("oopsie");

oopsie.add("indexes", assert => {

    const player1 = Player("Dierk");
    const player2 = Player("Florian");

    function assertIndexes(a,b,c,d) {
        assert.is(player1.getFallbackIndex(), a);
        assert.is(player1.getProgressIndex(), b);
        assert.is(player2.getFallbackIndex(), c);
        assert.is(player2.getProgressIndex(), d);
    }

    assertIndexes(0,0,0,0); // start positions

    player1.proceed(1);
    assertIndexes(0,1,0,0);
    player1.turn();
    assertIndexes(1,1,0,0);

    player2.proceed(2);
    assertIndexes(1,1,0,2);
    player2.proceed(2);
    assertIndexes(1,1,0,4);
    player2.turn();
    assertIndexes(1,1,4,4);

    player1.proceed(2);
    assertIndexes(1,3,4,4);
    player1.fallback();
    assertIndexes(1,1,4,4);

});

oopsie.run();

// requires inheritance.js

const inheritance = Suite("inheritance");
    
// ES6 inheritance scheme
inheritance.add("ES6", assert => {

    class Person {
        constructor(name) {
            this.name = name;
            this.worklog = [];
        }
        mustDo() {
            return ""
        }
        work() {
            this.worklog.push(this.mustDo());
        }
    }

    const p = new Person("unknown");
    assert.is(p.worklog.length, 0);  // initially empty
    p.work();
    assert.is(p.worklog[0], "");     // superclass impl

    class Student extends Person {
        mustDo() {
            return "fill quiz"
        }
    }

    const s = new Student();
    assert.is(s.worklog.length, 0);  // initially empty
    s.work();
    assert.is(s.worklog[0], "fill quiz");  // subclass impl
    assert.is(s.name, undefined);  // super ctor not enforced

    assert.true(s instanceof Student);
    assert.is(s.__proto__, Student.prototype);
    assert.is(Object.getPrototypeOf(s), Student.prototype);
    assert.true(s instanceof Person);
    assert.true(s instanceof Object);
    assert.true(Student instanceof Function);

});


// composition by delegation, here: decorator pattern
inheritance.add("delegate", assert => {

    function Prof(worker) {
        const worklog  = [];
        return {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        }
    }

    const wl = Prof( {work: () => ""} );
    assert.is(wl.worklog.length ,  0);  // initially empty
    wl.work();
    assert.is(wl.worklog[0] ,  "");     // superclass impl

    function Student(name) {
        return {
            name:  name,
            work:  () => name + " filled quiz"
        }
    }

    const p = Prof(Student("top"));
    assert.is(p.worklog.length ,  0);  // initially empty
    p.work();
    assert.is(p.worklog[0] ,  "top filled quiz");  // subclass impl

});

// setting the prototype of an object dynamically
inheritance.add("setProto", assert => {

    function Prof(worker) {
        const worklog  = [];
        const result = {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        };
        Object.setPrototypeOf(result, Prof.prototype);
        return result
    }

    const wl = Prof( {work: () => ""} );

    assert.true(wl instanceof Prof);

});

inheritance.run();

const TodoController = () => {

    const Todo = () => {                                // facade
        const textAttr = Observable("text");            // we current don't expose it as we don't use it elsewhere
        const doneAttr = Observable(false);
        return {
            getDone:       doneAttr.getValue,
            setDone:       doneAttr.setValue,
            onDoneChanged: doneAttr.onChange,
            setText:       textAttr.setValue,
            getText:       textAttr.getValue,
            onTextChanged: textAttr.onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();
    // todo: we need a scheduler

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = Todo();

        todoModel.add(newTodo);
        newTodo.setText('...');

        scheduler.add( ok =>
           fortuneService( text => {        // todo: schedule the fortune service and proceed when done
                   newTodo.setText(text);
                   ok();
               }
           )

        );



    };

    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        addFortuneTodo:     addFortuneTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="42">
                <input type="checkbox">            
            `;
            return template.children;
        }
        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick    = _ => todoController.removeTodo(todo);

        todoController.onTodoRemove( (removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        } );

        todo.onTextChanged(() => inputElement.value = todo.getText());

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};

const todoSuite = Suite("todo");

todoSuite.add("todo-crud", assert => {

    // setup
    const todoContainer = document.createElement("div");
    const numberOfTasks = document.createElement("span");
    numberOfTasks.innerText = '0';
    const openTasks = document.createElement("span");
    openTasks.innerText = '0';

    const todoController = TodoController();

    TodoItemsView(todoController, todoContainer);  // three views that share the same controller and thus model
    TodoTotalView(todoController, numberOfTasks);
    TodoOpenView (todoController, openTasks);

    const elementsPerRow = 3;

    assert.is(todoContainer.children.length, 0*elementsPerRow);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');

    todoController.addTodo();

    assert.is(todoContainer.children.length, 1*elementsPerRow);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');

    todoController.addTodo();

    assert.is(todoContainer.children.length, 2*elementsPerRow);
    assert.is(numberOfTasks.innerText, '2');
    assert.is(openTasks.innerText, '2');

    const firstCheckbox = todoContainer.querySelectorAll("input[type=checkbox]")[0];
    assert.is(firstCheckbox.checked, false);

    firstCheckbox.click();

    assert.is(firstCheckbox.checked, true);

    assert.is(todoContainer.children.length, 2*elementsPerRow); // did not change
    assert.is(numberOfTasks.innerText, '2');                    // did not change
    assert.is(openTasks.innerText, '1');                        // changed

    // add a test for the deletion of a todo-item

    // delete a checked item

    const firstDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    firstDeleteBtn.click();

    assert.is(todoContainer.children.length, 1*elementsPerRow);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');      // remains!

    // delete an unchecked item

    const secondDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    secondDeleteBtn.click();

    assert.is(todoContainer.children.length, 0*elementsPerRow);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');      // changes

});

todoSuite.add("todo-memory-leak", assert => {  // variant with remove-me callback
    const todoController = TodoController();

    todoController.onTodoAdd(todo => {
       todoController.onTodoRemove( (todo, removeMe) => {
           removeMe(); // un- / comment to see the difference
       });
    });

    for (let i=0; i<10000; i++){   // without removeMe:  10000 : 2s, 20000: 8s, 100000: ???s
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.add("todo-memory-leak-2", assert => {  // variant with listener identity
    const todoController = TodoController();

    todoController.onTodoAdd(todo => {

       const removeListener = todo => {
           // do the normal stuff, e.g. remove view elements
           // then remove yourself
           todoController.removeTodoRemoveListener(removeListener);
       };
       todoController.onTodoRemove( removeListener );
    });

    for (let i=0; i<10000; i++){
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.run();

// Using only function scope. No "class", "new", or "this".

function progressPie(canvas, progressFraction, showThumb) {
    const centerx   = canvas.width  / 2;
    const centery   = canvas.height / 2;
    const radius    = Math.min(centerx, centery);
    const ctx       = canvas.getContext('2d');
    const clockwise = false;

    const getCSS = propname =>  window.getComputedStyle(canvas, null).getPropertyValue(propname).toString().trim();

    // from 0-100 % to position on the circle circumference, 0 should be at the top
    const adjust = fraction => (fraction - 0.25) * 2.0 * Math.PI;

    const gradient = (radius, color) => {
        const grad = ctx.createRadialGradient( centerx, centery, 0, centerx, centery, radius * 2 );
        grad.addColorStop(0,"white");
        grad.addColorStop(1, color);
        return grad;
    };

    function pieSlice(start, end, radius, color) {
        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.arc(centerx, centery, radius, adjust(start), adjust(end), clockwise);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function thumb(progressFraction) {
        const factor = 0.7;
        const tcentery =  factor * Math.sin(adjust(progressFraction)) * (canvas.height / 2) + centery ;
        const tcenterx =  factor * Math.cos(adjust(progressFraction)) * (canvas.width  / 2) + centerx ;

        const size = Math.min(40, canvas.height / 10);

        const inner = ctx.createLinearGradient(tcenterx - size, tcentery - size, tcenterx + size, tcentery + size );
        inner.addColorStop(0,   "rgba(0,0,0,0.3)");
        inner.addColorStop(0.8, "rgba(255,255,255,0.7)");

        const rim = ctx.createLinearGradient(tcenterx - size, tcentery - size, tcenterx + size, tcentery + size );
        rim.addColorStop(0.2, "white");
        rim.addColorStop(1,   "rgba(0,0,0,0.3)");

        ctx.beginPath();
        ctx.arc(tcenterx, tcentery, size, adjust(0), adjust(100));
        ctx.strokeStyle = rim;
        ctx.stroke();
        ctx.fillStyle = inner;
        ctx.fill();
    }

    function paint() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        // background arcs
        const divider = Number(getCSS("--section-divider"));
        pieSlice(0, divider, radius, gradient(radius, getCSS("--section-one-color")));
        pieSlice(divider, 1, radius, gradient(radius, getCSS("--section-two-color")));

        // progress arc
        pieSlice(0, progressFraction, radius * 0.9, getCSS("--progress-color"));

        if(showThumb) thumb(progressFraction);
    }
    paint();
}

// from mouse or touch event on the canvas to a 0..1 value
const valueFromEvent = (progressView, evt) => {
    let relativeX = evt.offsetX; // selection position via mouse or touch where 0,0 is the canvas top left corner
    let relativeY = evt.offsetY;
    if (evt.type.startsWith("touch")) {
        const rect = evt.target.getBoundingClientRect();
        relativeX  = evt.targetTouches[0].clientX - rect.left;
        relativeY  = evt.targetTouches[0].clientY - rect.top;
    }
    // normalize into cartesian coords where 0,0 is at the center of a unit circle
    let y = 2 * (((progressView.height / 2) - relativeY) / progressView.height);
    let x = 2 * (relativeX / progressView.width - 0.5);
    let angle = Math.atan2(y, x) ;                              // (x,y) angle to x axis as in polar coords
    angle = (angle < 0) ? Math.PI + (Math.PI + angle) : angle;  // x-axis counterclockwise 0..2*pi
    let val = 1 - (angle / (2*Math.PI));                        // normalize to 0..1, clockwise
    val += 0.25;                                                // set relative to top, not x axis
    return (val > 1) ? val -1 : val;
};

// requires /util/test.js

const gauge = Suite("gauge");

gauge.add("no-exception", assert => {

    const canvas = document.createElement("canvas");

    canvas.style = "" +
                   "--section-divider:   0.6;" +
                   "--section-one-color: red;" +
                   "--section-two-color: green;" +
                   "--progress-color:    rgba(116,160,194,0.5);";

    document.body.appendChild(canvas);

    try {
        progressPie(canvas, 0.55);
        assert.true(true);
    } catch(err) {
        assert.true(false);
    }

    document.body.removeChild(canvas);
});

gauge.add("evt-value", assert => {

    const progressView = {width: 200, height: 200};

    assert.is( valueFromEvent( progressView, {type: "", offsetX: 100, offsetY:  0}), 1);
    assert.is( Math.floor( 100 * valueFromEvent( progressView, {type: "", offsetX: 101, offsetY:  0})), 0);
    assert.is( valueFromEvent( progressView, {type: "", offsetX: 200, offsetY:100}), 0.25);
    assert.is( valueFromEvent( progressView, {type: "", offsetX: 100, offsetY:200}), 0.5);
    assert.is( valueFromEvent( progressView, {type: "", offsetX:   0, offsetY:  0}), 7/8);
});

gauge.run();

// the mod module

const pi = Math.PI;

// use module as a singleton

// make a single state that is only exposed as values, not references to objects

let a = null; // these variables are exported as read-only
let b = null;

const setA = v => a = v;
const setB = v => b = v;

// x = 2 // introduction of new globals is not allowed in modules
// bundlers accept it, though, and produce code without the restriction.

const modSuite = Suite('mod');

modSuite.add("const", assert => {

    assert.true( pi > 0 ) ;

});

modSuite.add("singleton", assert => {

    assert.is(a, null);
    assert.is(b, null);

    setA("Dierk"); // there is no object exposed and so no target to attack
    setB("König");

    assert.is(a, "Dierk");
    assert.is(b, "König");

    // console.log(x); // newly introduced global x should not be visible but when using bundlers, it is

    // this kind of test does not work with the bundler as it checks the erroneous assignment
    // try {
    //     a = "shall not work";
    //     assert.true(false);
    // } catch (e) {
    //     assert.true("exported variables are read-only.")
    // }

});

modSuite.run();

// module Person (just an immutable product type)

// ctor

const Person =
    firstname =>
    lastname  =>
    Object.seal( selector  => selector (firstname) (lastname) );


// getters

const firstname = firstname => _ => firstname;
const lastname  = _ => lastname  => lastname;
const setLastname  = person => ln => Person (person(lastname)) (ln);

// module "methods"

const toString = person => 'Person ' + person(firstname) + " " +  person(lastname);

const equals   = p1 => p2 =>
    p1(firstname) === p2(firstname) &&
    p1(lastname)  === p2(lastname);

const toObj = person => ({
   firstname: person(firstname),
   lastname:  person(lastname)
});

const toPerson = personObj => Person (personObj.firstname) (personObj.lastname);

const person = Suite("person");

person.add("use", assert => {

    const dierk = Person ("Dierk") ('König');

    assert.is(dierk(firstname), "Dierk");

    const gently = setLastname(dierk)("Gently");

    assert.is( gently(lastname), "Gently");

    assert.true(   equals (dierk) (dierk)  );
    assert.true( ! equals (dierk) (gently) );

    assert.true( equals (dierk) (toPerson(toObj(dierk))) );
    assert.is( toString(dierk), 'Person Dierk König');

});

person.run();

const crazySuite = Suite("crazy");

crazySuite.add("equals", assert => {

    // assert.is( a == b, );
    // assert.is( b == c, );
    // assert.is( a == c, );
});

crazySuite.add("false", assert => {

    assert.true( ! false     );
    assert.true( ! null      );
    assert.true( ! undefined );
    assert.true( ! ""        );
    assert.true( ! 0         );
});

crazySuite.add("coercion", assert => {

    assert.true( "1"   == 1     );
    assert.true( +"2"  == 2     );
    assert.true( !"0"  == false );
    assert.true( !!"0" == true  );
    assert.is  ( Number("0"), 0 );
});

crazySuite.add("object", assert => {

    // assert.is( coerce("0")            , );
    // assert.is( coerce(+"0")           , );
    // assert.is( coerce(Number("0"))    , );
    // assert.is( coerce(new Number("0")), );

});

crazySuite.add("refactor", assert => {

    // const x = ; // fill here
    //
    // const if_1 = x => (x == true) ? true : false ;
    // const if_2 = x =>  x          ? true : false ; // safe refactoring ???
    //
    // assert.is( if_1(x), if_2(x) );  // is this true for every x ???

});


crazySuite.add("other", assert => {

    // assert.is( "2" + 1,      );
    // assert.is( "2" - 1,      );
    // assert.is( "2" - - 1,    );
    // assert.is( 1 + 2 + "3",  );

    // assert.is( +true,        );
    // assert.is( +false,       );
    // assert.is( true + true,  );
    // assert.is( [] == [],     );
    // assert.is( [] == ![],    );
    // assert.is( +[],          );
    // assert.is( 2 == [2],     );
    // assert.is( [] + {},      );
    // assert.is( {} + [],      );

});

crazySuite.add("numbers", assert => {

    // assert.is(Number("-0") ,            );
    // assert.is(JSON.parse("-0") ,        );
    // assert.is(JSON.stringify(-0) ,      );
    // assert.is(String(-0) ,              );
    // assert.is(typeof null ,             );
    // assert.is(null instanceof Object ,  );
    // assert.is(typeof NaN ,              );
    //
    // assert.is(typeof (1/0) ,            );
    // assert.is(0.1 + 0.2 === 0.3 ,       );
    // assert.is(999999999999999999 ,      );
    // assert.is(Number.MAX_VALUE > 0 ,    );
    // assert.is(Number.MIN_VALUE < 0 ,    );
    //
    // assert.is(Math.min(1, 2, 3) < Math.max(1, 2, 3) ,  );
    // assert.is(Math.min() < Math.max(),  );

});

crazySuite.add("compare", assert => {

    // assert.is(1 < 2 < 3 ,            );
    // assert.is(3 > 2 > 1 ,            );

    // assert.is( {} == {} ,            );
    // assert.is( {} >  {} ,            );
    // assert.is( {} >= {} ,            );

});


crazySuite.run();

// importing all tests that make up the suite of tests that are build on the ES6 module system
