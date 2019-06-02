
import { Person, firstname, setLastname, lastname, equals, toObj, toPerson, toString } from './Person.js'
import { Suite } from "../test/test.js"

const person = Suite("person");

person.add("use", assert => {

    const dierk = Person ("Dierk") ('König');

    assert.is(dierk(firstname), "Dierk");

    const gently = setLastname(dierk)("Gently");

    assert.is( gently(lastname), "Gently");

    assert.true(   equals (dierk) (dierk)  );
    assert.true( ! equals (dierk) (gently) );

    assert.true( equals (dierk) (toPerson(toObj(dierk))) );
    assert.is( toString(dierk), 'Person Dierk König')

});

person.run();