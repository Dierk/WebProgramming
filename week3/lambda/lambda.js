// atoms
const id    = x =>      x;
const konst = x => y => x;


// derived
const fst  = konst;
const snd  = konst(id);

const T = fst;
const F = snd;

const and = p => q => p(q)(p);

const M   = f => f(f);
const or  = M;

const Pair = x => y => selector => selector(x)(y);
const firstname = fst;
const lastname  = snd;

const Triple = x => y => z => f => f(x)(y)(z);
const tfirstname = x => y => z => x;
const tlastname  = x => y => z => y;
const tage       = x => y => z => z;

// const [Person, firstname, lastname, age] = Tuple(3);
// const dieter = Person("Dieter")("Holz")(53);
// dieter(firstname)

const Left   = x => f => g => f(x);
const Right  = x => f => g => g(x);
const either = id;







