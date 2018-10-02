// atoms
const id    = x =>      x;
const konst = x => y => x;


// derived
const I  = id;
const K  = konst;
const KI = konst (id);
