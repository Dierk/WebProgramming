
// This is kind of a silly variant for encoding object that makes
// use of the fact that a function is just an object and thus has
// an associated dynamic scope.
// The use of "this" is mandatory in all "methods".
// Forgetting to "instantiate" with "new" will cause all kinds of
// trouble.

import { Suite } from "../test/test.js"

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
