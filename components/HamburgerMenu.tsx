// components/HamburgerMenu.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PANEL_WIDTH = 250;


console.log("🍔 HamburgerMenu loaded");

const HamburgerMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();

  const go = (path: RelativePathString) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setMenuOpen(true)}
        style={styles.hamburgerButton}
        activeOpacity={0.7}
      >
        <FontAwesome name="bars" size={24} color="#333" />
      </TouchableOpacity>

      {menuOpen && (
        <>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

          <View style={styles.menuPanel}>
            <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              style={styles.closeButton}
            >
              <FontAwesome name="chevron-left" size={24} color="#333" />
            </TouchableOpacity>

            {isLoggedIn && user && (
              <Text style={styles.userName}>
                {user.first_name} {user.last_name}
              </Text>
            )}

            {!isLoggedIn ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go('/home' as RelativePathString)}
                >
                  <Text style={styles.menuText}>Αρχική Οθόνη</Text>
                </TouchableOpacity>

                <Text style={styles.promptText}>
                  Κάνε σύνδεση ή εγγραφή για πλήρη πρόσβαση
                </Text>

                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => go('/login' as RelativePathString)}
                >
                  <Text style={styles.authButtonText}>Σύνδεση</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => go('/register' as RelativePathString)}
                >
                  <Text style={styles.authButtonText}>Εγγραφή</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go('/multistepform' as RelativePathString)}
                >
                  <Text style={styles.menuText}>Κλείσε Ραντεβού</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go('/services' as RelativePathString)}
                >
                  <Text style={styles.menuText}>Υπηρεσίες</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go('/history' as RelativePathString)}
                >
                  <Text style={styles.menuText}>Ιστορικό</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go('/AccountDetails' as RelativePathString)}
                >
                  <Text style={styles.menuText}>Στοιχεία Λογαριασμού</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    logout();
                    go('/login' as RelativePathString);
                  }}
                >
                  <Text style={styles.logoutText}>Αποσύνδεση</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 1000,
  },
  hamburgerButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backdrop: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.4)',
    top: 0,
    left: 0,
    zIndex: 998,
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PANEL_WIDTH,      // <- εδώ το σταθερό πλάτος
    maxHeight: SCREEN_HEIGHT *0.8,
    paddingBottom: 20,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 6,
    zIndex: 999,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  promptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 12,
  },
  authButton: {
    marginVertical: 6,
    backgroundColor: '#00ADFE',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#ff5252',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default HamburgerMenu;
