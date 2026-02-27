import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import styles from "./HelpScreen.styles";
import { Header } from '../../components/Header/Header';
import globals from '../../styles/globals.styles';
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase.config';
import { useSession } from '../../context/SessionContext';

interface RequestType {
  id: string;
  restaurantId: string;
  tableId: string;
  userName: string;
  reason: string;
  status: 'pending' | 'attended';
  createdAt: string;
}

export const HelpScreen = () => {
  const { restaurantId, tableId, userName } = useSession();

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeRequest, setActiveRequest] = useState<RequestType | null>(null);
  const [timerString, setTimerString] = useState("00:00");

  useEffect(() => {
    if (!restaurantId || !tableId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "requests"),
      where("restaurantId", "==", restaurantId),
      where("tableId", "==", tableId),
      where("status", "==", "pending") 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data() as RequestType;
        setActiveRequest({ ...docData, id: snapshot.docs[0].id });
      } else {
        setActiveRequest(null);
        setTimerString("00:00");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [restaurantId, tableId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeRequest && activeRequest.createdAt) {
      const updateTimer = () => {
        const created = new Date(activeRequest.createdAt).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, now - created);
        const totalSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const minStr = String(minutes).padStart(2, '0');
        const secStr = String(seconds).padStart(2, '0');
        
        setTimerString(`${minStr}:${secStr}`);
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRequest]);

  const handleSendRequest = async () => {
    if (!restaurantId || !tableId) return;
    setSending(true);

    try {
      const newRequest = {
        restaurantId,
        tableId,
        userName,
        reason: reason.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "requests"), newRequest);
      
      setReason("");

    } catch (error) {
      console.error("Error sending help request:", error);
      Alert.alert("Error", "Could not call staff.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={[globals.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={globals.container}>
      <Header />
        <View style={globals.menuTitleContainer}>
          <View>
            <Text style={globals.menuTitle}>Presence</Text>
            <Text style={globals.menuSubtitle}>Request a staff member</Text>
          </View>
        </View>

        {!activeRequest ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Call staff</Text>
              <Text style={styles.label}>Reason (optional):</Text>

              <TextInput
                style={styles.input}
                placeholder="Help with payment"
                placeholderTextColor="#888"
                value={reason}
                onChangeText={setReason}
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSendRequest}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send request</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.statusBox}>
            <Text style={styles.statusLine}>Status: SENT • {timerString}</Text>
            
            <Text style={styles.statusMessage}>
              Wait a little, we are calling someone to help you.
              {activeRequest.reason ? `\nReason: "${activeRequest.reason}"` : ''}
            </Text>
          </View>
        )}
    </View>
  );
};