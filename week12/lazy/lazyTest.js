
import { STOP, iterate, take, cons, drop, dropWhile, each, takeWhile, toArray, toIterable } from "./lazy.js"
import { Suite } from "../test/test.js"

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