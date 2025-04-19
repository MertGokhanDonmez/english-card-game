import React, { useState } from "react";
import {
  TouchableOpacity,
  TextInput,
  View,
  Alert,
  Text,
  Image,
} from "react-native";
import { FlashCardType } from "../types/flashCard";
import ImagePickerModal from "../app/imageModal";

const handleCardCreate = (card: FlashCardType) => {
  console.log("Kart Oluşturuldu:", card);
};

export default function AddScreen() {
  const [backText, setBackText] = useState("");
  const [imageUri, setImageUri] = useState<string | "">("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageSelect = (uri: string) => {
    setImageUri(uri);
    setModalVisible(false);
  };

  const virtualCard: FlashCardType = {
    id: Date.now().toString(),
    frontImage: imageUri,
    backText: backText,
    createdAt: new Date(),
    tags: [],
  };

  return (
    <View className="p-4 flex items-center justify-center flex-1 mt-16">
      {imageUri && (
        <View className="mt-4">
          <Text className="text-center">Seçilen Görsel:</Text>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        </View>
      )}

      <TextInput
        className="h-12 border rounded-lg p-2 mt-4 w-[50%]"
        placeholder="İngilizce karşılık"
        value={backText}
        onChangeText={setBackText}
      />

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelect}
      />
      <View className="flex flex-row gap-[10%] mt-4">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 items-center"
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text className="text-center text-white">Görsel Seç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 items-center"
          onPress={() => {
            if (!imageUri || !backText) {
              Alert.alert("Hata", "Lütfen tüm alanları doldurun");
              return;
            }
            handleCardCreate(virtualCard);
          }}
        >
          <Text className="text-center text-white">Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
