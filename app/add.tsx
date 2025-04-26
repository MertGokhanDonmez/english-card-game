import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Alert,
  Text,
  Image,
  Animated,
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
  const flipAnimation = useRef(new Animated.Value(0)).current;

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

  // Front Card rotation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const flipToFrontStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
    backfaceVisibility: "hidden" as const,
  };

  // Back Card rotation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 90, 91],
    outputRange: [0, 0, 1],
  });

  const flipToBackStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
    backfaceVisibility: "hidden" as const,
    zIndex: isCardFlipped ? 10 : 0,
  };

  // Card Animation
  const flipCard = () => {
    if (isCardFlipped) {
      // back to front
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 12,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      // front to back
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 12,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsCardFlipped(!isCardFlipped);
  };

  return (
    <SafeAreaView className={`flex-1 p-4`}>
      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelect}
      />

      <BackButton />

      <View className="items-center flex-1">
        <View className="relative w-[300px] h-[500px] mt-20">
          <TouchableOpacity
            className="absolute w-full h-full"
            style={{ zIndex: isCardFlipped ? 0 : 10 }}
            onPress={() => {
              if (!isCardFlipped) {
                setModalVisible(true);
              }
            }}
          >
            <Animated.View className="w-full h-full" style={flipToFrontStyle}>
              <View className="w-full h-full rounded-2xl border-2 border-black overflow-hidden">
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../assets/images/card_add_image.png")}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            style={flipToBackStyle}
            className="absolute w-full h-full rounded-2xl items-center justify-center border-2 border-black overflow-hidden bg-white"
          >
            <TextInput
              className="w-full h-full text-center text-2xl p-4"
              placeholder="Type the word"
              value={backText}
              onChangeText={setBackText}
              autoFocus={isCardFlipped}
            />
          </Animated.View>
        </View>

        <View className="flex py-8 flex-row gap-[10%]">
          {!isCardFlipped ? (
            <>
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
                onPress={flipCard}
              >
                <Text className="text-center text-white">Onayla</Text>
              </TouchableOpacity>
            </>
          ) : (
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
          )}
        </View>

        <CheckedModal
          visible={showAlert}
          onClose={() => setShowAlert(false)}
          onClear={() => handleClear()}
          onCardCreate={() => {
            Animated.spring(flipAnimation, {
              toValue: 0,
              friction: 12,
              tension: 10,
              useNativeDriver: true,
            }).start();
            setIsCardFlipped(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
