// ============================================
// AUTHCONTEXT.JS - SISTEM ZA PRIJAVU KORISNIKA
// ============================================
// Ovaj fajl je kao "cuvar" koji pamti ko je prijavljen u aplikaciju.
// Zamislite ga kao vratar koji pusta samo one koji znaju lozinku.
// Svi ekrani mogu pitati ovaj fajl: "Ko je trenutno prijavljen?"

import React, { createContext, useState, useContext } from 'react';

// Uvozim listu korisnika iz JSON fajla
// To je kao mala "baza podataka" sa imenima i lozinkama
import users from '../data/users.json';


// ============================================
// PRAVIM CONTEXT (SKLADISTE)
// ============================================
// Context je kao "skladiste" gdje cuvam podatke o prijavljenom korisniku.
// Svi ekrani u aplikaciji mogu pristupiti ovom skladistu.
const AuthContext = createContext();


// ============================================
// PROVIDER KOMPONENTA
// ============================================
// Ova komponenta "omata" cijelu aplikaciju.
// Ona cuva podatke i daje ih svima koji trebaju.
// "children" su svi ekrani koji se nalaze unutar nje.
export const AuthProvider = ({ children }) => {
  
  // Ovdje cuvam podatke o prijavljenom korisniku
  // Na pocetku je "null" - to znaci da niko nije prijavljen
  const [user, setUser] = useState(null);
  
  // Ovo mi govori da li se trenutno vrsi prijava (loading)
  // Koristim ga da pokazem krug koji se vrti dok cekam
  const [isLoading, setIsLoading] = useState(false);


  // ============================================
  // FUNKCIJA ZA PRIJAVU
  // ============================================
  // Ova funkcija prima korisnicko ime i lozinku.
  // Provjerava da li postoji taj korisnik i da li je lozinka tacna.
  // Vraca "true" ako je prijava uspjela, "false" ako nije.
  const login = (username, password) => {
    // Ukljuci loading - pokazujem da radim nesto
    setIsLoading(true);
    
    // Trazim korisnika u mojoj listi
    // find() prolazi kroz sve korisnike i vraca onog koji ima
    // isto korisnicko ime I istu lozinku
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    // Koristim Promise da simuliram "pravo" cekanje (kao da zovem server)
    // U pravoj aplikaciji, ovdje bih slao zahtjev na internet
    return new Promise((resolve) => {
      // Cekam 500 milisekundi (pola sekunde) da izgleda realnije
      setTimeout(() => {
        if (foundUser) {
          // Nasao sam korisnika! Spremam ga u state.
          setUser(foundUser);
          setIsLoading(false);
          resolve(true); // Prijava je uspjela!
        } else {
          // Nisam nasao korisnika - pogresno ime ili lozinka
          setIsLoading(false);
          resolve(false); // Prijava nije uspjela
        }
      }, 500);
    });
  };


  // ============================================
  // FUNKCIJA ZA ODJAVU
  // ============================================
  // Ova funkcija brise podatke o korisniku.
  // Kada se pozove, korisnik vise nije prijavljen.
  const logout = () => {
    setUser(null); // Brisem korisnika - sada niko nije prijavljen
  };


  // ============================================
  // VRACAM PROVIDER
  // ============================================
  // Provider daje sve podatke i funkcije svim ekranima.
  // "value" sadrzi sve sto zelim podijeliti:
  // - user: podaci o prijavljenom korisniku
  // - isLoading: da li se vrsi prijava
  // - login: funkcija za prijavu
  // - logout: funkcija za odjavu
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// ============================================
// CUSTOM HOOK - LAKSI NACIN ZA KORISTENJE
// ============================================
// Ovo je pomocna funkcija koju zovem "useAuth".
// Umjesto da pisem dugi kod, samo kazem useAuth() i dobijem sve podatke.
// To je kao precica!
export const useAuth = () => {
  // Uzimam podatke iz Context-a
  const context = useContext(AuthContext);
  
  // Provjeravam da li se hook koristi na pravom mjestu
  // Mora biti unutar AuthProvider-a, inace nece raditi
  if (!context) {
    throw new Error('useAuth se mora koristiti unutar AuthProvider-a!');
  }
  
  return context;
};

export default AuthContext;
