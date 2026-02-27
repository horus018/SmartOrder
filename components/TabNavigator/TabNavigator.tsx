import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Image,
  Text
} from 'react-native';

import { MenuScreen } from '../../screens/MenuScreen/MenuScreen';
import { OrdersScreen } from '../../screens/OrdersScreen/OrdersScreen';
import { ProfileScreen } from '../../screens/ProfileScreen/ProfileScreen';
import { HelpScreen } from '../../screens/HelpScreen/HelpScreen';
import { AccountScreen } from '../../screens/AccountScreen/AccountScreen';
import { CartScreen } from '../../screens/CartScreen/CartScreen';
import styles from './TabNavigator.styles';
import { clientTabs, adminTabs, employeeTabs, TabItem } from './tabConfig';
import { useSession } from '../../context/SessionContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface TabNavigatorProps {
  role: 'client' | 'admin' | 'employee' | 'newemployee';
}

export const TabNavigator = ({ role }: TabNavigatorProps) => {
  const { restaurantId, tableId } = useSession();
  
  const registry: Record<string, TabItem[]> = {
    client: clientTabs,
    admin: adminTabs,
    employee: employeeTabs
  };

  const tabs = registry[role];
  const [currentTab, setCurrentTab] = useState<TabItem['name']>('Home');
  const [floatingCartActive, setFloatingCartActive] = useState(false);
  const [totalCartItems, setTotalCartItems] = useState(0);

  useEffect(() => {
    if (!restaurantId || !tableId) {
        setTotalCartItems(0);
        return;
    }

    const cartDocId = `cart_${restaurantId}_${tableId}`;
    const cartRef = doc(db, 'carts', cartDocId);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const items = data.items || [];
        const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        setTotalCartItems(total);
      } else {
        setTotalCartItems(0);
      }
    });

    return () => unsubscribe();
  }, [restaurantId, tableId]);

  const openCart = () => setFloatingCartActive(true);
  const closeCart = () => setFloatingCartActive(false);

  const confirmOrder = () => {
    setFloatingCartActive(false);
    setCurrentTab('Orders');
  };

  const screenComponent = (() => {
    switch (currentTab) {
      case 'Home': 
        return (
          <MenuScreen 
            onNavigateToCart={openCart}
          />
        );
      case 'Orders': return <OrdersScreen />;
      case 'Profile': return <ProfileScreen />;
      case 'Help': return <HelpScreen />;
      case 'Account': return <AccountScreen />;
      default:
        return (
          <MenuScreen 
            onNavigateToCart={openCart}
          />
        );
    }
  })();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, position: 'relative' }}>
        {!floatingCartActive && screenComponent}

        {floatingCartActive && (
          <View style={styles.screenContainerFloating}>
            <CartScreen 
              onCloseCart={closeCart}
              onConfirmOrder={confirmOrder}
            />
          </View>
        )}
      </View>

      <View style={[styles.tabBar, { zIndex: 10 }]}>
        {tabs.map(tab => {
          const isActive = !floatingCartActive && currentTab === tab.name;
          const color = isActive ? 'white' : '#000';

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                setCurrentTab(tab.name);
                setFloatingCartActive(false);
              }}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.tabInactive,
                  isActive && styles.tabActive,
                  isActive && { backgroundColor: '#DAB86E' }
                ]}
              >
                {tab.icon({ color })}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {totalCartItems > 0 && (
        <TouchableOpacity
          style={[
            styles.floatingCartButton,
            floatingCartActive && { backgroundColor: '#DAB86E' }
          ]}
          onPress={openCart}
        >
          <Image
            source={require('../../assets/icon_cart.png')}
            style={[
              styles.cartIconImage,
              floatingCartActive && { tintColor: '#fff' }
            ]}
          />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};