import { Suite } from "../test/test.js"
import { Tuple, Pair, fst, snd } from "./rock";

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

rock.run();