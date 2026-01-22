// AuthContext.js - Kontekst za autorizaciju korisnika
// Ovaj fajl upravlja prijavom i odjavom korisnika u aplikaciji
// Koristi se za cuvanje podataka o prijavljenom korisniku kroz cijelu aplikaciju

import React, { createContext, useState, useContext } from 'react';

// Uvozimo podatke o korisnicima iz JSON fajla
import users from '../data/users.json';

// Kreiramo kontekst - ovo je kao "skladiste" za podatke o korisniku
// Context omogucava da podaci budu dostupni svim komponentama bez "prop drilling-a"
const AuthContext = createContext();

// Provider komponenta - "omata" cijelu aplikaciju i daje pristup podacima
// Sve komponente unutar AuthProvider mogu pristupiti user podacima
export const AuthProvider = ({ children }) => {
  // State za cuvanje podataka o prijavljenom korisniku
  // null znaci da niko nije prijavljen
  const [user, setUser] = useState(null);
  
  // State za pracenje da li se vrsi ucitavanje (loading spinner)
  const [isLoading, setIsLoading] = useState(false);

  // Funkcija za prijavu korisnika
  // Prima korisnicko ime i lozinku, vraca true ako je uspjesno
  const login = (username, password) => {
    setIsLoading(true);
    
    // Trazimo korisnika u nasoj "bazi" (JSON fajl)
    // find() prolazi kroz sve korisnike i vraca prvog koji odgovara
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    // Simuliramo pravu prijavu sa malim kasnjenjem (500ms)
    // U pravoj aplikaciji, ovdje bi bio API poziv
    return new Promise((resolve) => {
      setTimeout(() => {
        if (foundUser) {
          // Ako smo nasli korisnika, spremi ga u state
          setUser(foundUser);
          setIsLoading(false);
          resolve(true); // Prijava uspjesna
        } else {
          setIsLoading(false);
          resolve(false); // Prijava neuspjesna
        }
      }, 500);
    });
  };

  // Funkcija za odjavu korisnika
  // Jednostavno brise sve podatke o korisniku
  const logout = () => {
    setUser(null);
  };

  // Vraca Provider sa svim podacima i funkcijama
  // value prop sadrzi sve sto zelimo podijeliti sa drugim komponentama
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook - laksi nacin za koristenje AuthContext-a
// Umjesto useContext(AuthContext), pisemo samo useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Provjera da li se hook koristi unutar AuthProvider-a
  // Ovo sprecava greske ako neko zaboravi wrap-ovati aplikaciju
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
