import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import styles from './CreatePassword,styles';

export const CreatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSave = () => {
    if (!newPassword || !repeatPassword) {
      alert('Please fill in both fields.');
      return;
    }

    if (newPassword !== repeatPassword) {
      alert('Passwords do not match.');
      return;
    }

    alert('Password saved successfully!');
  };

  return (
    <ImageBackground 
      source={require('../../assets/bg_restaurant.png')}
      style={styles.background}
    >
      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>SmartOrder</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Create Password</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Repeat Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={repeatPassword}
              onChangeText={setRepeatPassword}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
};