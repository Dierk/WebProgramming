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
