import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import { Header } from "../../components/Header/Header";
import globals from "../../styles/globals.styles";
import { styles, rateStyles, thankStyles } from "./AccountScreen.styles";
import Icon from "@expo/vector-icons/Ionicons";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../firebase.config";
import { useSession } from "../../context/SessionContext";

export const AccountScreen = () => {
  const { restaurantId, tableId, userName } = useSession();

  const [total, setTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fullyPaid = total > 0 && Math.abs(total - paid) < 0.01; // change to true for testing rating
  const amountDue = Math.max(0, total - paid);
  const [screen, setScreen] = useState<"account" | "rate" | "thankyou">("account");
  const [rating, setRating] = useState(0);
  const [anonymous, setAnonymous] = useState(false);
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (!restaurantId || !tableId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("restaurantId", "==", restaurantId),
      where("tableId", "==", tableId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let calcTotal = 0;
      let calcPaid = 0;
      let calcItems = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const orderTotal = data.total || 0;
        const status = data.status || "Pending";
        const items = data.items || [];

        calcTotal += orderTotal;
        if (status === "Paid") {
          calcPaid += orderTotal;
        }
        const itemsQty = items.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
        calcItems += itemsQty;
      });

      setTotal(calcTotal);
      setPaid(calcPaid);
      setTotalItems(calcItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [restaurantId, tableId]);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert("Rate us", "Please select a star rating.");
      return;
    }

    setSubmitting(true);

    try {
      const ratingData = {
        restaurantId,
        tableId,
        rating,
        comments: comments.trim(),
        isAnonymous: anonymous,
        userId: anonymous ? 'Anonymous' : (auth.currentUser?.uid || 'unknown'),
        userName: anonymous ? 'Anonymous' : userName,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "ratings"), ratingData);
      
      setSubmitting(false);
      setScreen("thankyou");

    } catch (error) {
      console.error("Error saving rating:", error);
      Alert.alert("Error", "Could not submit rating.");
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderAccount = () => {
    if (loading) {
      return (
        <View style={[globals.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      );
    }

    return (
      <View style={globals.container}>
        <Header />
        <View style={globals.menuTitleContainer}>
          <View>
            <Text style={globals.menuTitle}>Account</Text>
            <Text style={globals.menuSubtitle}>Bill Summary</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.labelBold}>Total</Text>
            <Text style={styles.items}>{totalItems} items</Text>
          </View>
          <View style={styles.dottedLine} />
          <Text style={styles.value}>€ {total.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.labelBold}>Paid</Text>
            <Text style={styles.items}>{paid > 0 ? "Processed" : "No payments"}</Text>
          </View>
          <View style={styles.dottedLine} />
          <Text style={styles.value}>€ {paid.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.labelBold}>Amount due</Text>
            <Text style={styles.items}>To pay</Text>
          </View>
          <View style={styles.dottedLine} />
          <Text style={styles.valueBold}>€ {amountDue.toFixed(2)}</Text>
        </View>

        {fullyPaid ? (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => setScreen("rate")}
          >
            <Text style={styles.rateButtonText}>
              Rate our service!
            </Text>
          </TouchableOpacity>
        ) : (
           <View style={{ marginTop: 20, alignItems: 'center' }}>
             <Text style={{ color: '#888', fontStyle: 'italic' }}>
               Payment is pending or partial.
             </Text>
           </View>
        )}
      </View>
    );
  };

  const renderRateScreen = () => {
    return (
      <View style={globals.container}>
        <Header />
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <Text style={rateStyles.title}>Rate the Service</Text>
          <Text style={rateStyles.subtitle}>Thanks for your payment!</Text>
          <Text style={rateStyles.question}>How was your service?</Text>

          <View style={rateStyles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Icon
                  name={n <= rating ? "star" : "star-outline"}
                  size={36}
                  color="#C8A23B"
                  style={{ marginRight: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={rateStyles.checkRow}
            onPress={() => setAnonymous(!anonymous)}
            activeOpacity={0.8}
          >
            <Icon
              name={anonymous ? "checkbox" : "square-outline"}
              size={24}
              color="#0B0F14"
            />
            <Text style={rateStyles.checkLabel}>Anonymous rating</Text>
          </TouchableOpacity>

          <Text style={rateStyles.addComments}>Additional comments</Text>
          <TextInput
            placeholder="Write your feedback here..."
            style={rateStyles.input}
            multiline
            value={comments}
            onChangeText={setComments}
          />

          <TouchableOpacity
            style={rateStyles.submitButton}
            onPress={handleSubmitRating}
            disabled={submitting}
          >
            {submitting ? (
                 <ActivityIndicator color="#fff" />
            ) : (
                <Text style={rateStyles.submitText}>Submit rating</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderThankYou = () => {
    return (
      <View style={[globals.container, thankStyles.center]}>
        <Icon name="checkmark-circle" size={110} color="#7BC67E" />
        <Text style={thankStyles.title}>Thank you for using SmartOrder</Text>
        <Text style={thankStyles.subtitle}>Come back anytime!</Text>

        <TouchableOpacity
          style={thankStyles.button}
          onPress={handleLogout}
        >
          <Text style={thankStyles.buttonText}>Good bye</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (screen === "rate") return renderRateScreen();
  if (screen === "thankyou") return renderThankYou();
  return renderAccount();
};