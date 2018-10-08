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

const pair = x => y => f => f(x)(y);

const fst = p => p (T);
const snd = p => p (F);

const iff = expr => expr ? T : F;

const pEquals = p1 => p2 => fst(p1) === fst(p2) && snd(p1) === snd(p2) ? T : F;
const pShow  = p => "(" + fst(p) + "," + snd(p) + ")";

// monoid
const pOp     = op => p1 => p2 => pair
    (op(fst(p1))(fst(p2)))
    (op(snd(p1))(snd(p2)));

// functor
const pMap = f => p => pair (f(fst(p))) (f(snd(p)));

