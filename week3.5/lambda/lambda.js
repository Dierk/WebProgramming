// atoms
const id    = x =>      x;
const konst = x => y => x;


// derived
const I  = id;
const K  = konst;
const KI = konst (id);


const flip = f => x => y => f(y)(x);
const C  = flip;

// const KI = flip (K);

const T  = konst;
// const F  =  KI;
// const F  =  flip(K);
const F  =  flip(T);

const not = flip ;

const and = p => q => p (q) (p);
// const and = p => flip (p) (p);

const M  = f => f(f); // self-application, Mockingbird
const or = M;

const pair = x => y => f => f(x)(y);

const fst = p => p (T);
const snd = p => p (F);

