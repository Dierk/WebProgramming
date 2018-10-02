// requires lambda.js

// id
document.writeln( id(1) === 1 );
document.writeln( id(id) === id );

// konst
document.writeln( konst(42)(0) === 42 );
document.writeln( konst(42)(1) === 42 );
document.writeln( konst(42)(null) === 42 );

// kite
document.writeln( konst(id)(null)(42) === 42 );
document.writeln( KI(null)(42) === 42 );

// true

// false

// and

// or

// beq

// pair

// pair equal

// either

// maybe