import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type Props = {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
};

export default function ImagePickerModal({
  visible,
  onClose,
  onImageSelected,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      setIsLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 5],
        quality: 0.7,
      });
      console.log(result);

      if (!result.canceled) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Fotoğraf seçme hatası:", error);
      alert("Fotoğraf seçilirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Kamera izni verilmedi.");
        return;
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [3, 5],
        quality: 1,
      });

      if (!result.canceled) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Fotoğraf seçme hatası:", error);
      alert("Fotoğraf seçilirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade">
      <View className="flex-1 justify-center bg-black/50">
        <View className="bg-white mx-4 p-6 rounded-lg">
          <Text className="text-lg font-bold mb-4">Resim Ekle</Text>

          {isLoading ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className="text-gray-600 mt-2">Yükleniyor...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded mb-2"
                onPress={pickImage}
              >
                <Text className="text-white text-center">Galeriden Seç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-500 p-3 rounded mb-2"
                onPress={takePhoto}
              >
                <Text className="text-white text-center">Fotograf Cek</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border border-gray-300 p-3 rounded"
                onPress={onClose}
              >
                <Text className="text-gray-700 text-center">İptal</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
