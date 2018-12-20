
import { Suite } from "../test/test.js"
import { normalizeX, normalizeY } from "./plotter.js"

const plotter = Suite("plotter");

plotter.add("normalize", assert => {

    assert.is( normalizeY(100)(-1) , 100 ); // baseline
    assert.is( normalizeY(100)( 1) , 0 );   // scale to top

    assert.is( normalizeX(100)( 0) , 0 );   // left origin
    assert.is( normalizeX(100)( 6) , 100 ); // scale to right end
});

plotter.run();