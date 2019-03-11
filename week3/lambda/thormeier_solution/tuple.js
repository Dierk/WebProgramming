/**
 * Builds a tuple-like function recursively with a given final behaviour (i.e. what to do once all parameters are given)
 */
const Tuple = size => {
  // Inner function to create a tuple-function builder
  const createFunctionBuilder = size => endBehaviour => {
    // Inner function to create a structure such as `function (x5) { return function (x4) { return func...`
    const buildFunction = size => {
      if (size === 0) {
        return endBehaviour;
      }

      return new Function(`x${size}`, 'return ' + buildFunction(size - 1).toString());
    };

    return buildFunction(size);
  };

  // Create a function builder that only needs to final bevahiour of the function attached to it
  const functionBuilder = createFunctionBuilder(size);
  const paramNames = [...Array(size).keys()].reverse().map(n => `x${n + 1}`);

  // Constructor needs something like `f => f(x0)(x1)(x2)...`
  const constructor = functionBuilder(`f => f(${paramNames.join(')(')})`);

  // Constructor + a bunch of accessor functions
  return [constructor, ...paramNames.map(p => functionBuilder(p))];
};

// Test code
let [Person, firstname, lastname, age] = Tuple(3);

const alice = Person('Alice')('Alice\'s Lastname')(50); // Konstruktor
document.writeln(alice(firstname) === 'Alice'); // Zugriffe
document.writeln(alice(lastname) === 'Alice\'s Lastname');
document.writeln(alice(age)      === 50);

// Try it out with four
let [PersonFour, firstnameFour, lastnameFour, ageFour, dateOfBirth] = Tuple(4);
const bob = PersonFour('Bob')('Bob\'s Lastname')(45)('1974-01-10');
document.writeln(bob(firstnameFour) === 'Bob');
document.writeln(bob(lastnameFour) === 'Bob\'s Lastname');
document.writeln(bob(ageFour)      === 45);
document.writeln(bob(dateOfBirth)  === '1974-01-10');

// Try it out with two
let [PersonTwo, firstnameTwo, lastnameTwo] = Tuple(2);
const cedric = PersonTwo('Cedric')('Cedric\'s last name');
document.writeln(cedric(firstnameTwo) === 'Cedric');
document.writeln(cedric(lastnameTwo) === 'Cedric\'s last name');

// Some kind of debugging:
document.writeln("\n" + 'Example of generated function:');
let [DebugConstructor, fstDebug] = Tuple(2);
document.writeln("\n" + 'Constructor:');
document.writeln(DebugConstructor.toString());
document.writeln("\n" + 'Example of an accessor:');
document.writeln(fstDebug.toString());


// -----------------------------------------

// tuple
const [Dude, fn, ln, ag] = Tuple(3);
const person = Person("Dierk")("König")(50);
document.writeln( person(fn) === "Dierk");
document.writeln( person(ln) === "König");
document.writeln( person(ag) === 50);

// composed Tuple

const [Team, lead, deputy] = Tuple(2);
const team = Team (person) (Dude("Roger")("Federer")(35));
document.writeln( team(lead)(fn)   === "Dierk"); // composite descent needs no extra () !
document.writeln( team(deputy)(ln) === "Federer");