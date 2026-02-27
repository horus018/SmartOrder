import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, Image, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { Feather } from '@expo/vector-icons';
import globals from '../../styles/globals.styles';
import styles from './OrdersScreen.styles';
import { Header } from '../../components/Header/Header';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useSession } from '../../context/SessionContext';

const imageMap: { [key: string]: ImageSourcePropType } = {
  'mock_espresso': require('../../assets/mock_espresso.png'),
  'mock_espresso.png': require('../../assets/mock_espresso.png'),
  'mock_cappuccino': require('../../assets/mock_cappuccino.png'),
  'mock_cappuccino.png': require('../../assets/mock_cappuccino.png'),
  'mock_mixed_pie': require('../../assets/mock_mixed_pie.png'),
  'mock_mixed_pie.png': require('../../assets/mock_mixed_pie.png'),
  'mock_chicken': require('../../assets/mock_chicken.png'),
  'mock_chicken.png': require('../../assets/mock_chicken.png'),
};

type OrderStatus = 'All' | 'Pending' | 'Delivered' | 'Paid';

interface OrderProductType {
  id: string;
  item: string;
  description: string;
  quantity: number;
  price: number;
  imageName?: string;
}

interface OrderType {
  id: string;
  items: OrderProductType[];
  observations?: string;
  createdAt?: string;
  status?: OrderStatus;
  employee?: string;
  tableId?: string;
}

const statusMap: { [key in OrderStatus]: { style: keyof typeof styles; label: string } } = {
  All: { style: 'statusPending', label: 'All' },
  Pending: { style: 'statusPending', label: 'PENDING' },
  Delivered: { style: 'statusDelivered', label: 'DELIVERED' },
  Paid: { style: 'statusPaid', label: 'PAID' },
};

interface FlatListItemType extends OrderProductType {
  orderId: string;
  orderStatus: OrderStatus;
  orderCreatedAt: string;
  employee?: string;
}

const OrderItem: React.FC<{ item: FlatListItemType }> = ({ item }) => {
  const statusInfo = statusMap[item.orderStatus] || statusMap.Pending;
  const unitPrice = item.price / item.quantity;
  const imageKey = item.imageName || 'mock_espresso';
  const resolvedKey = Object.keys(imageMap).find(k => k.includes(imageKey)) || 'mock_espresso';
  const imageSource = imageMap[resolvedKey];

  return (
    <View style={styles.orderItemContainer}>
      <Image
        source={imageSource}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.item}</Text>
        <Text style={styles.subtitle}>
          {statusInfo.label} • {new Date(item.orderCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {item.employee && ` • by ${item.employee}`}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={[styles.statusText, styles[statusInfo.style]]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>
      <View style={styles.itemPriceContainer}>
        <Text style={styles.itemPrice}>€ {unitPrice.toFixed(2).replace('.', ',')}</Text>
        <Text style={{fontSize: 12, color: '#888', textAlign: 'right'}}>x{item.quantity}</Text>
      </View>
    </View>
  );
};

export const OrdersScreen = () => {
  const { restaurantId, tableId } = useSession();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filter, setFilter] = useState<OrderStatus>('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId || !tableId) {
        setLoading(false);
        return;
    }

    const q = query(
        collection(db, 'orders'),
        where('restaurantId', '==', restaurantId),
        where('tableId', '==', tableId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedOrders: OrderType[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as OrderType));

        loadedOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        setOrders(loadedOrders);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [restaurantId, tableId]);

  const flatListItems: FlatListItemType[] = orders
    .filter(order => Array.isArray(order.items)) 
    .flatMap(order => {
      const orderStatus = (order.status ?? 'Pending') as OrderStatus;
      const orderCreatedAt = order.createdAt ?? new Date().toISOString();

      return order.items.map(product => ({
        ...product,
        orderId: order.id,
        orderStatus,
        orderCreatedAt,
        employee: order.employee,
        id: `${order.id}-${product.id}`, 
      }));
    })
    .filter(item => filter === 'All' || item.orderStatus === filter) as FlatListItemType[];

  const handleSelectFilter = (status: OrderStatus) => {
    setFilter(status);
    setDropdownVisible(false);
  };

  return (
    <View style={globals.container}>
      <Header/>
      <View style={globals.menuTitleContainer}>
        <View>
          <Text style={globals.menuTitle}>Orders</Text>
          <Text style={globals.menuSubtitle}>Track statuses</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Feather name="menu" size={24} color="#333" />
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {flatListItems.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}/>
        <View style={styles.modalPositionWrapper}>
          <View style={styles.modalDropdown}>
            {(['All', 'Pending', 'Delivered', 'Paid'] as OrderStatus[]).map(status => (
              <TouchableOpacity
                key={status}
                style={styles.modalOption}
                onPress={() => handleSelectFilter(status)}
              >
                <Text style={[
                  styles.modalOptionText,
                  filter === status && styles.selectedOptionText
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator size="large" color="#333" style={{marginTop: 50}} />
      ) : (
        <FlatList
            data={flatListItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={{ color: '#888', fontSize: 16 }}>
                        No orders found {filter !== 'All' ? `for ${filter}` : ''}.
                    </Text>
                </View>
            }
            renderItem={({ item }) => (
            <OrderItem item={item} />
            )}
        />
      )}
    </View>
  );
};