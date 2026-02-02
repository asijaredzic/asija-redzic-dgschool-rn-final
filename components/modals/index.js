// ============================================================
// INDEX.JS - Izvoz svih modala na jednom mjestu
// ============================================================
// Modali su prozori koji se pojave preko ekrana.
// Na primjer kad hoces poslati novac, otvori se SendModal.
// Ovaj fajl ih sve izvozi da ih mogu lakse koristiti.
// ============================================================

// BaseModal je osnovni modal - svi ostali ga koriste kao temelj
export { default as BaseModal } from './BaseModal';

// SendModal - prozor za slanje novca prijateljima
export { default as SendModal } from './SendModal';

// ReceiveModal - prozor za primanje novca (QR kod ili link)
export { default as ReceiveModal } from './ReceiveModal';

// ConvertModal - prozor za mijenjanje valuta (USD u EUR, itd.)
export { default as ConvertModal } from './ConvertModal';

// TransactionDetailModal - prozor koji pokazuje detalje jedne transakcije
export { default as TransactionDetailModal } from './TransactionDetailModal';
