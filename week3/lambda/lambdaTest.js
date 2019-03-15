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

// tuple
const [Person, fn, ln, ag] = Tuple(3);
const person = Person("Dierk")("König")(50);
document.writeln( person(fn) === "Dierk");
document.writeln( person(ln) === "König");
document.writeln( person(ag) === 50);

// composed Tuple

const [Team, lead, deputy] = Tuple(2);
const team = Team (person) (Person("Roger")("Federer")(35));
document.writeln( team(lead)(fn)   === "Dierk");
document.writeln( team(deputy)(ln) === "Federer");

// Pair equal

// either

const safeDiv = num => divisor =>
    divisor === 0
    ? Left("schlecht!")
    : Right(num / divisor);

either( safeDiv(1)(0)  )
      (console.log)
      (console.error);


const [Cash, CreditCard, Invoice, PayPal, pay] = EitherOf(4);
const cash = Cash ();
const card = CreditCard ("0000-1111-2222-3333");
const invo = Invoice    ({name:"Roger", number:"4711"});
const pal  = PayPal     (person);  // the payload can be a partially applied function, e.g. Tuple ctor
const doPay = method =>
    pay (method)
        ( _       => "paid cash")
        ( number  => "credit card "+number)
        ( account => account.name + " " + account.number )
        ( person  => "pal: " + person(fn) );

document.writeln( doPay(cash) === "paid cash");
document.writeln( doPay(card) === "credit card 0000-1111-2222-3333");
document.writeln( doPay(invo) === "Roger 4711");
document.writeln( doPay(pal ) === "pal: Dierk");


// maybe