// ============================================================
// RECEIVE MODAL - Prozor za primanje novca
// ============================================================
// Ja sam napravila ovaj prozor da korisnik moze primiti novac.
// Imam dva nacina za primanje: QR kod ili link.
// QR kod je kao ona slika sa kvadraticima koju mozes skenirati.
// Link je tvoja adresa koju mozes poslati prijatelju.
// ============================================================

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BaseModal from './BaseModal';

// Ovo je moja komponenta za primanje novca
// visible = da li je prozor vidljiv
// onClose = funkcija za zatvaranje
// userName = ime korisnika
const ReceiveModal = ({ visible, onClose, userName = 'Student' }) => {
  
  // Ovdje pamtim koji nacin je odabran: 'qr' ili 'link'
  // Na pocetku je QR kod odabran
  const [selectedMethod, setSelectedMethod] = useState('qr');

  // Pravim "lazni" wallet ID - ovo je kao tvoja adresa za novac
  // U pravoj aplikaciji ovo bi bilo pravo, ali za demo pravim random
  const walletId = 'STU-2024-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  // Kad korisnik hoce da kopira ID
  const handleCopy = () => {
    // U pravoj aplikaciji bi se ID stvarno kopirao
    // Za sada samo pokazujem poruku
    Alert.alert('Kopirano!', 'Wallet ID je kopiran u clipboard');
  };

  // Kad korisnik hoce da podijeli
  const handleShare = () => {
    // U pravoj aplikaciji bi se otvorilo dijeljenje (jer je ovo samo projekat finalni)
    Alert.alert('Dijeljenje', 'Otvara se opcija za dijeljenje...');
  };

  return (
    // Koristim BaseModal kao osnovu - to mi daje okvir prozora
    <BaseModal visible={visible} onClose={onClose} title="Receive Money">
      
      {/* ========== TABOVI ZA ODABIR METODE ========== */}
      {/* Ovo su dva dugmeta: QR Code i Link */}
      <View style={styles.methodTabs}>
        
        {/* Prvo dugme - QR Code */}
        <TouchableOpacity
          style={[
            styles.methodTab, 
            // Ako je QR odabran, dodajem aktivni stil
            selectedMethod === 'qr' && styles.methodTabActive
          ]}
          onPress={() => setSelectedMethod('qr')}
        >
          <Ionicons 
            name="qr-code" 
            size={18} 
            // Ako je aktivno = bijela ikona, ako nije = siva
            color={selectedMethod === 'qr' ? '#FFFFFF' : '#A0A0C0'} 
          />
          <Text style={[
            styles.methodTabText,
            selectedMethod === 'qr' && styles.methodTabTextActive
          ]}>QR Code</Text>
        </TouchableOpacity>

        {/* Drugo dugme - Link */}
        <TouchableOpacity
          style={[
            styles.methodTab, 
            selectedMethod === 'link' && styles.methodTabActive
          ]}
          onPress={() => setSelectedMethod('link')}
        >
          <Ionicons 
            name="link" 
            size={18} 
            color={selectedMethod === 'link' ? '#FFFFFF' : '#A0A0C0'} 
          />
          <Text style={[
            styles.methodTabText,
            selectedMethod === 'link' && styles.methodTabTextActive
          ]}>Link</Text>
        </TouchableOpacity>
      </View>

      {/* ========== QR CODE PRIKAZ ========== */}
      {/* Ovo se pokazuje samo kad je odabran QR */}
      {selectedMethod === 'qr' && (
        <View style={styles.qrContainer}>
          {/* Pravim okvir koji izgleda kao QR kod */}
          <View style={styles.qrCode}>
            <View style={styles.qrInner}>
              {/* Koristim ikonu umjesto pravog QR koda za demo */}
              <Ionicons name="qr-code" size={120} color="#FFFFFF" />
            </View>
            {/* Ovo su ukrasi - uglovi oko QR koda */}
            <View style={[styles.qrCorner, styles.qrCornerTL]} />
            <View style={[styles.qrCorner, styles.qrCornerTR]} />
            <View style={[styles.qrCorner, styles.qrCornerBL]} />
            <View style={[styles.qrCorner, styles.qrCornerBR]} />
          </View>
          <Text style={styles.qrHint}>Skenirajte ovaj kod da posaljete novac</Text>
        </View>
      )}

      {/* ========== LINK PRIKAZ ========== */}
      {/* Ovo se pokazuje samo kad je odabran Link */}
      {selectedMethod === 'link' && (
        <View style={styles.linkContainer}>
          <Text style={styles.linkLabel}>Vas Wallet ID</Text>
          
          {/* Kutija sa ID-om i dugmetom za kopiranje */}
          <View style={styles.walletIdContainer}>
            <Text style={styles.walletId}>{walletId}</Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.linkHint}>
            Podijelite ovaj ID da primate novac od prijatelja
          </Text>
        </View>
      )}

      {/* ========== INFORMACIJE O KORISNIKU ========== */}
      <View style={styles.userInfo}>
        {/* Krug sa prvim slovom imena */}
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{userName.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userAccount}>Studentski racun</Text>
        </View>
      </View>

      {/* ========== DUGME ZA DIJELJENJE ========== */}
      <TouchableOpacity onPress={handleShare} activeOpacity={0.9}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.shareButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share</Text>
        </LinearGradient>
      </TouchableOpacity>
    </BaseModal>
  );
};

// ============================================================
// STILOVI - Kako sve izgleda
// ============================================================
const styles = StyleSheet.create({
  // ----- TABOVI -----
  methodTabs: {
    flexDirection: 'row',       // Postavljam ih jedan pored drugog
    backgroundColor: '#2D2D5A', // Tamna pozadina
    borderRadius: 12,           // Zaobljeni uglovi
    padding: 4,
    marginBottom: 25,
  },
  methodTab: {
    flex: 1,                    // Svaki tab uzima pola prostora
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  methodTabActive: {
    backgroundColor: '#8B5CF6', // Ljubicasta kad je aktivno
  },
  methodTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#A0A0C0',           // Siva kad nije aktivno
    marginLeft: 6,
  },
  methodTabTextActive: {
    color: '#FFFFFF',           // Bijela kad je aktivno
  },
  
  // ----- QR KOD -----
  qrContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#2D2D5A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',       // Da mogu staviti uglove
  },
  qrInner: {
    width: 160,
    height: 160,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // ----- QR UGLOVI - ukrasi -----
  qrCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#8B5CF6',
    borderWidth: 3,
  },
  qrCornerTL: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  qrCornerTR: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  qrCornerBL: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  qrCornerBR: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  qrHint: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    marginTop: 15,
    textAlign: 'center',
  },
  
  // ----- LINK -----
  linkContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  linkLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 10,
  },
  walletIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  walletId: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  copyButton: {
    marginLeft: 15,
    padding: 5,
  },
  linkHint: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    marginTop: 10,
    textAlign: 'center',
  },
  
  // ----- KORISNIK INFO -----
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,           // Krug
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  userAccount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
  
  // ----- DUGME ZA DIJELJENJE -----
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
  },
  shareButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default ReceiveModal;
