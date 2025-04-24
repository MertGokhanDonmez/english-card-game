import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Alert,
  Text,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { FlashCardType } from "../types/flashCard";
import ImagePickerModal from "../app/imageModal";
import CheckedModal from "./checkedModal";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";

export default function AddScreen() {
  const [backText, setBackText] = useState("");
  const [imageUri, setImageUri] = useState<string | "">("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const handleImageSelect = (uri: string) => {
    setImageUri(uri);
    setModalVisible(false);
  };

  const handleClear = () => {
    setImageUri("");
    setBackText("");
  };

  const handleCardCreate = (card: FlashCardType) => {
    console.log("Kart Oluşturuldu:", card);
    if (card) {
      setShowAlert(true);
    }
  };

  const virtualCard: FlashCardType = {
    id: Date.now().toString(),
    frontImage: imageUri,
    backText: backText,
    createdAt: new Date(),
    tags: [],
  };

  return (
    <SafeAreaView className={`flex-1 p-4`}>
      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelect}
      />

      <BackButton />

      <View className="items-center justify-center flex-1">
        {isCardFlipped ? (
          <>
            <TextInput
              className="rounded-2xl items-center border-2 border-black overflow-hidden"
              placeholder="Back Text"
              value={backText}
              onChangeText={setBackText}
            />
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

            <CheckedModal
              visible={showAlert}
              onClose={() => setShowAlert(false)}
              onClear={() => handleClear()}
              onCardCreate={() => setIsCardFlipped(false)}
            />
          </>
        ) : (
          <>
            <TouchableOpacity
              className="rounded-2xl items-center border-2 border-black overflow-hidden"
              onPress={() => {
                setModalVisible(true);
              }}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-[300px] h-[500px]"
                />
              ) : (
                <Image
                  source={require("../assets/images/card_add_image.png")}
                  className="w-[300px] h-[500px]"
                />
              )}
            </TouchableOpacity>
            <View className="flex py-8 flex-row gap-[10%]">
              <TouchableOpacity
                className="bg-orange-600 rounded-lg p-4 items-center"
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text className="text-center text-white">Tekrar Dene</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-500 rounded-lg p-4 items-center"
                onPress={() => {
                  setIsCardFlipped(true);
                }}
              >
                <Text className="text-center text-white">Onayla</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
