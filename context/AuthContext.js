// AuthContext.js - Ovaj fajl služi za čuvanje podataka o korisniku kroz cijelu aplikaciju
// Context je kao "kutija" koja čuva podatke i dijeli ih sa svim ekranima

import React, { createContext, useState, useContext } from 'react';

// Uvozimo podatke o korisnicima iz JSON fajla
import users from '../data/users.json';

// 1. KREIRANJE CONTEXT-a
// createContext() pravi praznu "kutiju" za naše podatke
const AuthContext = createContext();

// 2. PROVIDER KOMPONENTA
// Provider je komponenta koja "pruža" podatke drugim komponentama
// Sve komponente unutar Provider-a mogu pristupiti tim podacima
export function AuthProvider({ children }) {
  
  // useState za trenutnog korisnika
  // null znači da niko nije ulogovan na početku
  const [user, setUser] = useState(null);
  
  // useState za praćenje da li je korisnik ulogovan
  // false = nije ulogovan, true = jeste ulogovan
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // FUNKCIJA ZA LOGIN
  // Prima email i password koje korisnik unese
  const login = (email, password) => {
    
    // find() traži korisnika u nizu users
    // Provjerava da li se email I password poklapaju
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    // Ako smo pronašli korisnika
    if (foundUser) {
      setUser(foundUser);      // Spremamo podatke o korisniku
      setIsLoggedIn(true);     // Označavamo da je ulogovan
      return { success: true }; // Vraćamo uspjeh
    } else {
      // Ako nismo pronašli, vraćamo grešku
      return { success: false, message: 'Pogresan email ili lozinka!' };
    }
  };

  // FUNKCIJA ZA LOGOUT
  // Briše podatke o korisniku i označava da nije ulogovan
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Ovo su sve vrijednosti koje dijelimo sa drugim komponentama
  const value = {
    user,        // Podaci o ulogovanom korisniku
    isLoggedIn,  // Da li je neko ulogovan (true/false)
    login,       // Funkcija za prijavu
    logout,      // Funkcija za odjavu
  };

  // Provider komponenta "obavija" djecu i daje im pristup value
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. CUSTOM HOOK - useAuth
// Hook je funkcija koja počinje sa "use"
// Ovaj hook olakšava pristup AuthContext-u iz bilo koje komponente
export function useAuth() {
  // useContext uzima podatke iz AuthContext-a
  const context = useContext(AuthContext);
  
  // Ako neko pokuša koristiti useAuth van AuthProvider-a, javi grešku
  if (!context) {
    throw new Error('useAuth mora biti koristen unutar AuthProvider-a');
  }
  
  return context;
}
