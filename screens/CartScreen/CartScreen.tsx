import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image,
  TextInput,
  Modal,
  ImageSourcePropType,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import globals from '../../styles/globals.styles';
import styles from './CartScreen.styles';
import { Header } from '../../components/Header/Header';
import { doc, onSnapshot, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore'; 
import { db } from '../../firebase.config';
import { useSession } from '../../context/SessionContext';

const imageMap: { [key: string]: ImageSourcePropType } = {
  'mock_espresso.png': require('../../assets/mock_espresso.png'),
  'mock_espresso': require('../../assets/mock_espresso.png'),
  'mock_cappuccino.png': require('../../assets/mock_cappuccino.png'),
  'mock_cappuccino': require('../../assets/mock_cappuccino.png'),
  'mock_mixed_pie.png': require('../../assets/mock_mixed_pie.png'),
  'mock_mixed_pie': require('../../assets/mock_mixed_pie.png'),
  'mock_chicken.png': require('../../assets/mock_chicken.png'),
  'mock_chicken': require('../../assets/mock_chicken.png'),
};

interface CartItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  price_formatted: string;
  quantity: number;
  imageName: string;
  imagePath?: ImageSourcePropType;
  notes?: string;
}

interface OrderProductType {
  id: string;
  item: string;
  description: string;
  quantity: number;
  price: number;
  observations?: string;
}
interface OrderType {
  id: string;
  items: OrderProductType[];
  observations?: string;
  createdAt?: string;
}

interface CartScreenProps {
  onCloseCart: () => void;
  onConfirmOrder: () => void;
}

interface ConfirmationModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isVisible, onCancel, onConfirm }) => (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onCancel}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <AntDesign name="warning" size={40} color="#D63031" style={{ marginBottom: 15 }} />
          <Text style={styles.modalTitle}>Are you sure?</Text>
          <Text style={styles.modalMessage}>Are you sure you want to remove this item from your cart?</Text>
          <TouchableOpacity style={styles.modalRemoveButton} onPress={onConfirm}>
            <Text style={styles.modalButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancelButton} onPress={onCancel}>
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
);

const CartItem: React.FC<{ 
    item: CartItemType; 
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
  }> = ({ item, onUpdateQuantity, onRemove }) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
      <View style={styles.cartItemContainer}>
        <Image 
          source={item.imagePath || require('../../assets/mock_espresso.png')} 
          style={styles.cartItemImage} 
          resizeMode="cover" 
        />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          <Text style={styles.cartItemDescription}>{item.description}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={() => onUpdateQuantity(item.id, -1)} style={styles.controlButton}>
              <Text style={styles.controlText}>—</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => onUpdateQuantity(item.id, 1)} style={styles.controlButton}>
              <Text style={styles.controlText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.priceAndRemove}>
          <Text style={styles.cartItemPrice}>{item.price_formatted}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="close" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <ConfirmationModal isVisible={modalVisible} onCancel={() => setModalVisible(false)} onConfirm={() => { onRemove(item.id); setModalVisible(false); }} />
      </View>
    );
};

export const CartScreen: React.FC<CartScreenProps> = ({ onCloseCart, onConfirmOrder }) => {
  const { restaurantId, tableId, userName } = useSession();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalFormatted, setTotalFormatted] = useState('0,00');
  const [generalNotes, setGeneralNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId || !tableId) return;

    const cartDocId = `cart_${restaurantId}_${tableId}`;
    const cartRef = doc(db, 'carts', cartDocId);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      setLoading(false);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const rawItems = (data.items || []) as CartItemType[];
        
        const processedItems = rawItems.map(item => {
            const key = Object.keys(imageMap).find(k => k.includes(item.imageName)) || 'mock_espresso.png';
            return {
                ...item,
                imagePath: imageMap[key]
            };
        });

        setCartItems(processedItems);
        setTotalFormatted(data.total ? data.total.toFixed(2).replace('.', ',') : '0,00');
      } else {
        setCartItems([]);
        setTotalFormatted('0,00');
      }
    });

    return () => unsubscribe();
  }, [restaurantId, tableId]);

  const updateCartInFirestore = async (newItems: CartItemType[]) => {
    if (!restaurantId || !tableId) return;
    
    const newTotal = newItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const cartDocId = `cart_${restaurantId}_${tableId}`;
    const cartRef = doc(db, 'carts', cartDocId);

    try {
        const itemsToSave = newItems.map(({ imagePath, ...rest }) => rest);

        await updateDoc(cartRef, {
            items: itemsToSave,
            total: newTotal
        });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedItems); 
    updateCartInFirestore(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    updateCartInFirestore(updatedItems);
  };
  
  const handleConfirmOrder = async () => {
    if (cartItems.length === 0 || !restaurantId || !tableId) return;

    const orderItems = cartItems.map(item => ({
      id: item.id,
      item: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price * item.quantity,
      imageName: item.imageName
    }));

    const totalOrder = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    const newOrderData = {
      restaurantId,
      tableId,
      userId: userName,
      items: orderItems,
      total: totalOrder,
      observations: generalNotes.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'orders'), newOrderData);

      const cartDocId = `cart_${restaurantId}_${tableId}`;
      const cartRef = doc(db, 'carts', cartDocId);
      await setDoc(cartRef, { items: [], total: 0 }); 

      setCartItems([]);
      setGeneralNotes('');
      onConfirmOrder();

    } catch (e) {
      console.error('Error creating order in Firestore', e);
    }
  };

  return (
  <View style={globals.container}>
    <Header />

    <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} 
    >

        <View style={globals.menuTitleContainer}>
            <View>
                <Text style={globals.menuTitle}>Cart</Text>
                <Text style={globals.menuSubtitle}>Review your order</Text>
            </View>
        </View>
        
        {loading ? (
            <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
        ) : (
            <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                    <CartItem 
                    item={item} 
                    onUpdateQuantity={handleUpdateQuantity} 
                    onRemove={handleRemoveItem} 
                    />
                )}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.flatListPadding}
                ListEmptyComponent={
                    <View style={styles.emptyCartContainer}>
                        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                        <Text style={styles.emptyCartSubText}>Add items from the menu to confirm your order.</Text>
                    </View>
                }
            />
        )}

        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <Text style={[globals.menuSubtitle, { marginTop: 10 }]}>Notes</Text>
            <TextInput
                style={[styles.notesInput, { height: 80 }]}
                placeholder="No sugar in espresso (example)"
                placeholderTextColor="#888"
                value={generalNotes}
                onChangeText={setGeneralNotes}
                multiline
            />
        </View>

        <View style={styles.footerContainer}>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total: </Text>
                <Text style={styles.totalValue}>€ {totalFormatted}</Text>
            </View>

            <TouchableOpacity
                style={[
                styles.confirmButton,
                cartItems.length === 0 && styles.confirmButtonDisabled
                ]}
                onPress={handleConfirmOrder}
                disabled={cartItems.length === 0}
            >
                <Text style={styles.confirmButtonText}>Confirm order</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  </View>
  );
};