import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView,
  KeyboardAvoidingView, Platform, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.config";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import styles from './LoginScreen.styles';
import { User, UserRole } from '../../types/User';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onClientContinue: () => void;
  isLoading: boolean;
  setIsLoading: (b: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onClientContinue, setIsLoading, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginView, setIsLoginView] = useState(false);

  const handleLogin = async () => {
    const email = username.trim();
    const pass = password.trim();
    if (!email || !pass) { setError('Username and password are required.'); return; }

    setIsLoading(true);
    try {
      setError('');
      const credentials = await signInWithEmailAndPassword(auth, email, pass);

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      let userDoc;
      let userRole: UserRole = 'client';

      if (!querySnapshot.empty) {
        userDoc = querySnapshot.docs[0].data();
        userRole = userDoc.role;
      } else {
        const userRef = doc(db, "users", credentials.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          userDoc = userSnap.data();
          userRole = userDoc.role;
        } else {
          await setDoc(userRef, { role: 'client', email: email });
          userRole = 'client';
        }
      }

      onLoginSuccess({ username: credentials.user.email ?? '', role: userRole });

    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginCard = () => (
    <View style={styles.loginCard}>
      <TouchableOpacity style={styles.backButton} onPress={() => setIsLoginView(false)}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.loginTitle}>Login</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        onFocus={() => setError('')}
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Enter your password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={() => setError('')}
      />
      {error.length > 0 && <Text style={[styles.errorText]}>{error}</Text>}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInitialButtons = () => (
    <View style={styles.initialButtonsContainer}>
      <TouchableOpacity style={styles.loginButton} onPress={() => { setIsLoginView(true); setError(''); setUsername(''); setPassword(''); }}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clientButton} onPress={onClientContinue}>
        <Text style={styles.clientButtonText}>Continue as a client</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/bg_restaurant.png')} style={styles.background}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.appName}>SmartOrder</Text>
          </View>
          <View style={styles.bottomContentWrapper}>
            <View style={styles.bottomContent}>
              {isLoginView ? renderLoginCard() : renderInitialButtons()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ImageBackground>
  );
};
