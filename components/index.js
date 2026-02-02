// ============================================================
// INDEX.JS - Izvoz svih komponenti na jednom mjestu
// ============================================================
// Ja sam napravila ovaj fajl da bude lakse importovati komponente.
// Umjesto da pisem:
//   import BalanceCard from '../components/BalanceCard';
//   import ActionButton from '../components/ActionButton';
//   import TransactionItem from '../components/TransactionItem';
// 
// Sada mogu pisati samo:
//   import { BalanceCard, ActionButton, TransactionItem } from '../components';
// 
// To je mnogo krace i preglednije:)
// ============================================================

// Osnovne komponente - svaka prikazuje nesto na ekranu
export { default as BalanceCard } from './BalanceCard';         // Kartica sa balansom
export { default as ActionButton } from './ActionButton';       // Dugme za akcije
export { default as TransactionItem } from './TransactionItem'; // Jedna transakcija
export { default as ContactItem } from './ContactItem';         // Jedan kontakt
export { default as StatisticsBar } from './StatisticsBar';     // Traka sa statistikom
export { default as CreditCard } from './CreditCard';           // Kreditna kartica
export { default as SectionHeader } from './SectionHeader';     // Zaglavlje sekcije
export { default as CategoryFilter } from './CategoryFilter';   // Filter kategorija

// Modali - izvozim sve iz modals foldera
// Zvjezdica (*) znaci "sve sto ima"
export * from './modals';
