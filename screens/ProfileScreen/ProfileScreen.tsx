import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../../components/Header/Header";
import globals from "../../styles/globals.styles";
import styles from "./ProfileScreen.styles";

import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase.config"; 
import { useSession } from "../../context/SessionContext";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const ProfileScreen = () => {
  const { userName, userPhoto, updateUser } = useSession();
  const currentUserId = auth.currentUser?.uid;

  const [editMode, setEditMode] = useState(false);
  const [nickname, setNickname] = useState(userName);
  const [localPhoto, setLocalPhoto] = useState<string | undefined>(userPhoto);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNickname(userName);
    setLocalPhoto(userPhoto);
  }, [userName, userPhoto]);

  useEffect(() => {
    if (!editMode) setError('');
  }, [editMode]);

  const handleChangePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setLocalPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError("Username cannot be empty");
      return;
    }
    
    setError('');
    setSaving(true);

    try {
      let permanentUri = localPhoto;

      if (localPhoto && localPhoto !== userPhoto && currentUserId) {
        if (Platform.OS !== 'web') {
            try {
                const FS = FileSystem as any; 
                const docDir = FS.documentDirectory || FS.cacheDirectory;
                const photoDir = `${docDir}photos/${currentUserId}/`;
                const dirInfo = await FS.getInfoAsync(photoDir);

                if (!dirInfo.exists) {
                    await FS.makeDirectoryAsync(photoDir, { intermediates: true });
                }

                const filename = `profile_${Date.now()}.jpg`;
                const destUri = photoDir + filename;

                await FS.copyAsync({
                    from: localPhoto,
                    to: destUri
                });

                permanentUri = destUri;
            } catch (fsError) {
                console.error("Error saving photo:", fsError);
                permanentUri = localPhoto;
            }
        }
      }

      if (currentUserId) {
        const userRef = doc(db, "users", currentUserId);
        await updateDoc(userRef, {
          username: nickname
        });
      }

      updateUser(nickname, permanentUri);

      setEditMode(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={globals.container}>
      <Header />

      <View style={globals.menuTitleContainer}>
        <View>
          <Text style={globals.menuTitle}>
            {editMode ? "Edit Profile" : "Profile"}
          </Text>
          <Text style={globals.menuSubtitle}>
            {editMode ? "Customize your identity" : "Your session identity"}
          </Text>
        </View>
      </View>

      {!editMode && (
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
             {localPhoto ? (
                <Image 
                  source={{ uri: localPhoto }} 
                  style={{ width: 90, height: 90, borderRadius: 45 }} 
                />
             ) : (
                <Ionicons name="person" size={45} color="#C29B2F" />
             )}
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.username}>{nickname}</Text>
            <Text style={styles.description}>
              Your nickname/photo are visible to staff during this visit.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => setEditMode(true)}
          >
            <Ionicons name="create-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      {editMode && (
        <View>
          <View style={styles.editRow}>
            <TouchableOpacity onPress={handleChangePhoto}>
                <View style={styles.avatarCircleLarge}>
                    {localPhoto ? (
                        <Image 
                            source={{ uri: localPhoto }} 
                            style={{ width: 100, height: 100, borderRadius: 60 }} 
                        />
                    ) : (
                        <Ionicons name="person" size={60} color="#C29B2F" />
                    )}
                    
                    <View style={{
                        position: 'absolute', bottom: 0, right: 0, 
                        backgroundColor: '#333', borderRadius: 15, padding: 5
                    }}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.inputColumn}>
              <Text style={styles.label}>Name or nickname</Text>

              <TextInput
                style={[
                    styles.input, 
                    error ? { borderColor: '#ff4444', borderWidth: 1 } : {}
                ]}
                placeholder="Ex: User123"
                placeholderTextColor="#888"
                value={nickname}
                onChangeText={(text) => {
                    setNickname(text);
                    if (error) setError('');
                }}
              />
              
              {error ? (
                  <Text style={{ color: '#ff4444', fontSize: 12, marginTop: 4, marginLeft: 2 }}>
                      {error}
                  </Text>
              ) : null}

            </View>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handleChangePhoto}
            >
              <Text style={styles.changePhotoText}>Change photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};