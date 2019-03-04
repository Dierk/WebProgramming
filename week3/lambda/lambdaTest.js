// requires lambda.js

// id
document.writeln( id(1) === 1 );
document.writeln( id(id) === id );

// konst
document.writeln( konst(42)(0) === 42 );
document.writeln( konst(42)(1) === 42 );
document.writeln( konst(42)(null) === 42 );

// kite
document.writeln( snd(null)(42) === 42 );

// true

document.writeln( T(1)(0) === 1 );
document.writeln( F(1)(0) === 0 );

// and
document.writeln( and(F)(F) === F );
document.writeln( and(T)(F) === F );
document.writeln( and(F)(T) === F );
document.writeln( and(T)(T) === T );

// or
document.writeln( or(F)(F) === F );
document.writeln( or(T)(F) === T );
document.writeln( or(F)(T) === T );
document.writeln( or(T)(T) === T );

// flip
// flip(f)(x)(y) = f(y)(x)

// not

// beq

// Pair

const dierk = Pair("Dierk")("König"); // immutable
document.writeln( dierk(firstname) === "Dierk");
document.writeln( dierk(lastname)  === "König");

const tdierk = Triple("Dierk")("König")(50); // immutable
document.writeln( tdierk(tfirstname) === "Dierk");
document.writeln( tdierk(tlastname)  === "König");
document.writeln( tdierk(tage)       === 50);


// Pair equal

// either

const safeDiv = num => divisor =>
    divisor === 0
    ? Left("schlecht!")
    : Right(num / divisor);

either( safeDiv(1)(0)  )
      (console.log)
      (console.error);

// maybe