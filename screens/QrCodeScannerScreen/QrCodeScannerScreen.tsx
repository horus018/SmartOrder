import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'; 
import styles from './QrCodeScannerScreen.styles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config'; 

export interface ScannedData {
  restaurantId: string;
  restaurantName: string;
  tableId: string;
}

interface QrScannerScreenProps {
  onBack: () => void;
  onScanSuccess: (data: ScannedData) => void; 
}

export const QrScannerScreen: React.FC<QrScannerScreenProps> = ({ onBack, onScanSuccess }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.restaurantId && parsedData.tableId && parsedData.restaurantName) {
        setScanned(true); 
        onScanSuccess({
          restaurantId: parsedData.restaurantId,
          restaurantName: parsedData.restaurantName,
          tableId: parsedData.tableId
        });
      } else {
        console.error("Invalid QR Code structure (missing fields):", data);
      }
    } catch (error) {
      console.error("Scanned data is not valid JSON:", data);
    }
  };

  const handleManualEntry = async () => {
    const code = manualCode.trim();
    if (!code) return;

    if (isVerifying) return;

    setIsVerifying(true);

    try {
      const parts = code.split('_');
      
      if (parts.length < 2) {
        console.error("Invalid manual code format. Expected format: RESTAURANTID_SUFFIX");
        setIsVerifying(false);
        return;
      }

      const restaurantId = parts[0];

      const docRef = doc(db, 'restaurants', restaurantId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("Restaurant not found for ID:", restaurantId);
        setIsVerifying(false);
        return;
      }

      const data = docSnap.data();
      const tables = data.tables || {};
      const restaurantName = data.name || "Unknown Restaurant";

      let foundTableId: string | null = null;

      for (const [key, value] of Object.entries(tables)) {
        if ((value as any).code === code) {
          foundTableId = key;
          break;
        }
      }

      if (foundTableId) {
        setScanned(true);
        onScanSuccess({
          restaurantId: restaurantId,
          restaurantName: restaurantName,
          tableId: foundTableId
        });
      } else {
        console.error("Table code not found in this restaurant configuration.");
      }

    } catch (error) {
      console.error("Error verifying manual code:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const renderCameraContent = () => {
    let message;
    if (!permission) {
      message = 'Requesting camera permission...';
    } else if (!permission.granted) {
      message = 'No access to camera. Please enable it in your settings.';
    } else {
      message = 'Allow camera access to read the table QR';
    }
    
    if (!permission || !permission.granted) {
      return (
        <View style={styles.scannerAreaFallback}>
          <View style={styles.scannerAreaBorder}>
            <Text style={styles.scannerTextFallback}>{message}</Text>
            {!permission?.granted && permission !== null && (
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
    
    return (
      <CameraView 
        style={styles.camera} 
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      />
    );
  };

  const isCameraReady = permission?.granted;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonTop} onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color={'white'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.contentWrapper}>
          <View style={styles.cameraFrame}>
            {renderCameraContent()}
            
            {isCameraReady && (
              <View style={styles.scannerAreaOverlayAbsolute}>
                <Text style={styles.scannerTextOverlay}>Point to the QR Code</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder="Or enter the table code (ex: AV-12)"
              placeholderTextColor="#888"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity onPress={handleManualEntry} disabled={isVerifying}>
              {isVerifying ? (
                <ActivityIndicator size="small" color="#808080" style={styles.inputIcon} />
              ) : (
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="#808080" style={styles.inputIcon} />
              )}
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};