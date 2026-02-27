import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  ActivityIndicator,
  Alert,
  ImageSourcePropType
} from 'react-native';
import { Header } from '../../components/Header/Header';
import globals from '../../styles/globals.styles';
import styles from './MenuScreen.styles';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore'; 
import { db } from '../../firebase.config';
import { useSession } from '../../context/SessionContext'; 

interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  price_formatted: string;
  imagePath: ImageSourcePropType;
}

interface CartItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  price_formatted: string;
  quantity: number;
  imageName: string;
}

type SelectedItemsState = { [key: string]: number };

type RawMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  price_formatted: string;
  imagePath: string;
};

const imageMap: { [key: string]: ImageSourcePropType } = {
  'mock_espresso': require('../../assets/mock_espresso.png'),
  'mock_cappuccino': require('../../assets/mock_cappuccino.png'),
  'mock_mixed_pie': require('../../assets/mock_mixed_pie.png'),
  'mock_chicken': require('../../assets/mock_chicken.png'),
};

const MenuItem: React.FC<{ 
  item: MenuItemType; 
  selectedItems: SelectedItemsState; 
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItemsState>>;
  hasActiveSelection: boolean;
}> = ({ item, selectedItems, setSelectedItems, hasActiveSelection }) => {
  const quantity = selectedItems[item.id] || 0;
  const isSelected = quantity > 0;

  const handleLongPress = () => {
    if (!isSelected) {
      setSelectedItems(prev => ({ ...prev, [item.id]: 1 }));
    }
  };

  const handlePress = () => {
    if (isSelected) {
      const { [item.id]: _, ...rest } = selectedItems;
      setSelectedItems(rest);
    } else if (hasActiveSelection) {
      setSelectedItems(prev => ({ ...prev, [item.id]: 1 }));
    }
  };

  const handleUpdateQuantity = (delta: number) => {
    let newQuantity = quantity + delta;
    if (newQuantity <= 0) {
      const { [item.id]: _, ...rest } = selectedItems;
      setSelectedItems(rest);
    } else {
      setSelectedItems(prev => ({ ...prev, [item.id]: newQuantity }));
    }
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress} onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.menuItemContainer, isSelected && styles.menuItemContainerSelected]}>
        <Image source={item.imagePath} style={styles.menuItemImage} resizeMode="cover" />
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
        </View>
        <View style={styles.priceAndQuantity}>
          <Text style={styles.menuItemPrice}>{item.price_formatted}</Text>
          {isSelected && (
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => handleUpdateQuantity(-1)} style={styles.controlButton}>
                <Text style={styles.controlText}>—</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => handleUpdateQuantity(1)} style={styles.controlButton}>
                <Text style={styles.controlText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

interface MenuScreenProps {
  onNavigateToCart: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onNavigateToCart }) => {
  const { restaurantId, tableId } = useSession();
  
  const [selectedItems, setSelectedItems] = useState<SelectedItemsState>({}); 
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [rawMenuItems, setRawMenuItems] = useState<RawMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const hasItemsToAddToCart = Object.keys(selectedItems).length > 0;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const snapshot = await getDocs(collection(db, "menu"));
        const items: MenuItemType[] = [];
        const rawItems: RawMenuItem[] = [];

        snapshot.docs.forEach(doc => {
          const raw = doc.data() as RawMenuItem;
          rawItems.push({ ...raw, id: doc.id });

          const parts = raw.imagePath.split('/');
          const filename = parts[parts.length - 1].replace('.png', '');
          const key = Object.keys(imageMap).find(k => k.includes(filename)) || 'mock_espresso';
          const image = imageMap[key];

          items.push({
            id: doc.id,
            name: raw.name,
            description: raw.description,
            price: raw.price,
            price_formatted: raw.price_formatted,
            imagePath: image,
          });
        });

        setMenuItems(items);
        setRawMenuItems(rawItems);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = async () => {
    if (!hasItemsToAddToCart || !restaurantId || !tableId) return;
    setAddingToCart(true);

    try {
      const cartDocId = `cart_${restaurantId}_${tableId}`;
      const cartRef = doc(db, 'carts', cartDocId);
      const cartSnap = await getDoc(cartRef);
      let existingItems: CartItemData[] = [];

      if (cartSnap.exists()) {
        existingItems = cartSnap.data().items || [];
      }

      const newItemsToAdd = Object.keys(selectedItems).map(id => {
        const menuItem = menuItems.find(item => item.id === id);
        const rawItem = rawMenuItems.find(item => item.id === id);
        if (!menuItem) return null;

        let imageName = 'mock_espresso';
        if (rawItem) {
            const parts = rawItem.imagePath.split('/');
            imageName = parts[parts.length - 1];
        }

        return {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          price_formatted: menuItem.price_formatted,
          quantity: selectedItems[id],
          imageName: imageName
        } as CartItemData;
      }).filter((item): item is CartItemData => item !== null);

      const mergedItems = [...existingItems];

      newItemsToAdd.forEach(newItem => {
        const index = mergedItems.findIndex(exist => exist.id === newItem.id);
        if (index > -1) {
          mergedItems[index].quantity += newItem.quantity;
        } else {
          mergedItems.push(newItem);
        }
      });

      const newTotal = mergedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

      await setDoc(cartRef, {
        items: mergedItems,
        total: newTotal,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSelectedItems({});

    } catch (error) {
      console.error("Error updating cart:", error);
      Alert.alert("Error", "Could not add items to cart.");
    } finally {
      setAddingToCart(false);
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
      <Header/>
      <View style={globals.menuTitleContainer}>
        <View>
          <Text style={globals.menuTitle}>Menu</Text>
          <Text style={globals.menuSubtitle}>Select a product</Text>
        </View>
        
        {hasItemsToAddToCart && (
          <TouchableOpacity 
            style={styles.addToCartButton} 
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.addToCartButtonText}>Add to cart</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <MenuItem 
            item={item} 
            selectedItems={selectedItems} 
            setSelectedItems={setSelectedItems} 
            hasActiveSelection={hasItemsToAddToCart}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};