import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Header.styles';
import { useSession } from '../../context/SessionContext';

export const Header = () => {
    const { restaurantName, tableId, userName, userPhoto } = useSession();

    return (
        <View style={styles.header}>
            <View style={styles.userInfo}>
                <View style={styles.userIconBackground}>
                    <Image
                        key={userPhoto}
                        source={userPhoto ? { uri: userPhoto } : require('../../assets/icon_profile_fill.png')} 
                        style={[
                            styles.userIconImage, 
                            userPhoto ? { 
                                borderRadius: 20,
                                width: 40, 
                                height: 40,
                                tintColor: undefined
                            } : {} 
                        ]}
                        resizeMode={userPhoto ? "cover" : "contain"}
                    />
                </View>
                <View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.tableNumber}>{tableId}</Text> 
                </View>
            </View>
            <Text style={styles.headerButton}>
                <Text style={styles.headerButtonText}>{restaurantName}</Text>
            </Text>
        </View>
    );
};