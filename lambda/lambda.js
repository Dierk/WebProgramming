
// atoms
const id    = x =>      x;
const konst = x => y => x;


// derived
const F = konst (id);
const T = konst;

const pair = x => y => f => f(x)(y);
const fst  = p => p(T);
const snd  = p => p(F);