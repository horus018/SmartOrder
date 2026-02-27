import React, { useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { QrScannerScreen, ScannedData } from './screens/QrCodeScannerScreen/QrCodeScannerScreen';
import { CreatePassword } from './screens/CreatePasswordScreen/CreatePassword';
import { TabNavigator } from './components/TabNavigator/TabNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { User } from './types/User';
import { auth, db } from './firebase.config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; 
import { signInAnonymously } from 'firebase/auth';
import { SessionProvider } from './context/SessionContext'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

type AppState = 'login' | 'qr_scanner' | 'authenticated';

const App = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<ScannedData | null>(null);

  const handleLoginSuccess = (user: User) => {
    setLoggedUser(user);
    setAppState('authenticated');
  };

  const handleClientContinue = () => setAppState('qr_scanner');

  const handleBackToLogin = () => {
    setLoggedUser(null);
    setAppState('login');
  };

  const handleQrScanSuccess = async (data: ScannedData) => {
    setIsLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const uid = cred.user.uid;
      const tableNumber = data.tableId.replace(/\D/g, '') || '0'; 
      const randomSeq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
      const generatedUsername = `User_${tableNumber}_${randomSeq}`;
      const restaurantRef = doc(db, 'restaurants', data.restaurantId);
      const tableUpdateKey = `tables.${data.tableId}.status`;
      
      await updateDoc(restaurantRef, {
        [tableUpdateKey]: 'occupied'
      });

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        username: generatedUsername,
        role: 'client',
        currentSession: {
            restaurantId: data.restaurantId,
            tableId: data.tableId
        }
      });

      setSessionData(data);
      setLoggedUser({ username: generatedUsername, role: 'client' });
      setAppState('authenticated');

    } catch (err) {
      console.error("Error processing entry via QR Code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoggedUser(null);
        setAppState('login');
        setSessionData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        {appState === 'login' && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onClientContinue={handleClientContinue}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {appState === 'qr_scanner' && (
          <QrScannerScreen
            onBack={handleBackToLogin}
            onScanSuccess={handleQrScanSuccess}
          />
        )}

        {appState === 'authenticated' && loggedUser && (
          <>
            {(loggedUser.role === 'newemployee') && <CreatePassword />}
            {(['client','admin','employee'] as string[]).includes(loggedUser.role) && (
              <SessionProvider 
                value={sessionData ? {
                  restaurantId: sessionData.restaurantId,
                  restaurantName: sessionData.restaurantName,
                  tableId: sessionData.tableId,
                  userName: loggedUser.username
                } : null}
              >
                <TabNavigator role={loggedUser.role} />
              </SessionProvider>

            )}
          </>
        )}

        {isLoading && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 9999
          }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;