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

const pair = x => y => (selector => selector(x)(y));
const firstname = fst;
const lastname  = snd;







