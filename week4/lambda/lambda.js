
// atoms
const id    = x =>      x;
const konst = x => y => x;


// derived
const F = konst (id);
const T = konst;

const Pair = x => y => f => f(x)(y);
const fst  = p => p(T);
const snd  = p => p(F);

const Left   = x => f => g => f(x);
const Right  = x => f => g => g(x);
const either = e => f => g => e (f) (g);