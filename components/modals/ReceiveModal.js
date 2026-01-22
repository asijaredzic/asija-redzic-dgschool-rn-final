// ReceiveModal.js - Modal za primanje novca
// Prikazuje QR kod i informacije za primanje novca
// Ima opciju za dijeljenje i kopiranje

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

// Props: visible, onClose, userName (ime korisnika za prikaz)
const ReceiveModal = ({ visible, onClose, userName = 'Student' }) => {
  
  // State za odabranu metodu primanja
  const [selectedMethod, setSelectedMethod] = useState('qr');

  // Generisemo "lazni" wallet ID
  const walletId = 'STU-2024-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  // Funkcija za kopiranje wallet ID-a
  const handleCopy = () => {
    // U pravoj aplikaciji, ovdje bi koristili Clipboard
    Alert.alert('Kopirano!', 'Wallet ID je kopiran u clipboard');
  };

  // Funkcija za dijeljenje
  const handleShare = () => {
    // U pravoj aplikaciji, ovdje bi koristili Share API
    Alert.alert('Dijeljenje', 'Otvara se opcija za dijeljenje...');
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Receive Money">
      {/* Metode primanja - tabs */}
      <View style={styles.methodTabs}>
        <TouchableOpacity
          style={[styles.methodTab, selectedMethod === 'qr' && styles.methodTabActive]}
          onPress={() => setSelectedMethod('qr')}
        >
          <Ionicons 
            name="qr-code" 
            size={18} 
            color={selectedMethod === 'qr' ? '#FFFFFF' : '#A0A0C0'} 
          />
          <Text style={[
            styles.methodTabText,
            selectedMethod === 'qr' && styles.methodTabTextActive
          ]}>QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodTab, selectedMethod === 'link' && styles.methodTabActive]}
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

      {/* QR Code prikaz */}
      {selectedMethod === 'qr' && (
        <View style={styles.qrContainer}>
          {/* Simuliramo QR kod sa ikonama i okvirom */}
          <View style={styles.qrCode}>
            <View style={styles.qrInner}>
              <Ionicons name="qr-code" size={120} color="#FFFFFF" />
            </View>
            {/* Uglovi QR okvira */}
            <View style={[styles.qrCorner, styles.qrCornerTL]} />
            <View style={[styles.qrCorner, styles.qrCornerTR]} />
            <View style={[styles.qrCorner, styles.qrCornerBL]} />
            <View style={[styles.qrCorner, styles.qrCornerBR]} />
          </View>
          <Text style={styles.qrHint}>Skenirajte ovaj kod da posaljete novac</Text>
        </View>
      )}

      {/* Link prikaz */}
      {selectedMethod === 'link' && (
        <View style={styles.linkContainer}>
          <Text style={styles.linkLabel}>Vas Wallet ID</Text>
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

      {/* Korisnicke informacije */}
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{userName.charAt(0)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userAccount}>Studentski racun</Text>
        </View>
      </View>

      {/* Dugme za dijeljenje */}
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

const styles = StyleSheet.create({
  // Tabovi za metode
  methodTabs: {
    flexDirection: 'row',
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  methodTabActive: {
    backgroundColor: '#8B5CF6',
  },
  methodTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#A0A0C0',
    marginLeft: 6,
  },
  methodTabTextActive: {
    color: '#FFFFFF',
  },
  // QR kod
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
    position: 'relative',
  },
  qrInner: {
    width: 160,
    height: 160,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // QR uglovi
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
  // Link
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
  // Korisnicke info
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
    borderRadius: 25,
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
  // Dugme za dijeljenje
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
