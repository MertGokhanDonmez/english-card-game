import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Alert,
  Text,
  Image,
  Animated,
  TextInput,
  StyleSheet,
} from "react-native";
import { FlashCardType } from "@/types/flashCard";
import ImagePickerModal from "@/components/ImagePickerModal";
import CheckedModal from "@/components/CheckedModal";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { setItem } from "@/utils/storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/types/navigation";

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, "Add">;

export default function AddScreen() {
  const [backText, setBackText] = useState("");
  const [imageUri, setImageUri] = useState<string | "">("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<AddScreenNavigationProp>();

  const handleImageSelect = (uri: string) => {
    setImageUri(uri);
    setModalVisible(false);
  };

  const handleClear = () => {
    setImageUri("");
    setBackText("");
  };

  const handleCardCreate = async (card: FlashCardType) => {
    try {
      await setItem(card.backText, card);
      console.log("Card saved successfully:", card);
      setShowAlert(true);
    } catch (error) {
      console.error("Error saving card:", error);
      Alert.alert("Error", "Failed to save the card. Please try again.");
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

  const flipToBackStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
    backfaceVisibility: "hidden" as const,
    zIndex: isCardFlipped ? 10 : 0,
  };

  // Card Animation
  const flipCard = () => {
    if (isCardFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 12,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
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
    <SafeAreaView style={styles.safeArea}>
      <BackButton navigation={navigation} />

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={handleImageSelect}
      />
      <CheckedModal
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        onClear={handleClear}
        onCardCreate={() => {
          Animated.spring(flipAnimation, {
            toValue: 0,
            friction: 12,
            tension: 10,
            useNativeDriver: true,
          }).start();
          setIsCardFlipped(false);
        }}
        flipAnimation={flipAnimation}
        setIsCardFlipped={setIsCardFlipped}
      />
      <View style={styles.centerContainer}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.absoluteFill, { zIndex: isCardFlipped ? 0 : 10 }]}
            onPress={() => {
              if (!isCardFlipped) {
                setModalVisible(true);
              }
            }}
          >
            <Animated.View style={[styles.fullSize, flipToFrontStyle]}>
              <View style={styles.cardFront}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/card_add_image.png")}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[flipToBackStyle, styles.cardBack]}>
            <TextInput
              style={styles.textInput}
              placeholder="Type the word"
              value={backText}
              onChangeText={setBackText}
              autoFocus={isCardFlipped}
              caretHidden={true}
            />
          </Animated.View>
        </View>

        <View style={styles.buttonContainer}>
          {!isCardFlipped ? (
            <>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Tekrar Dene</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={flipCard}>
                <Text style={styles.buttonText}>Onayla</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (!imageUri || !backText) {
                  Alert.alert("Hata", "Lütfen tüm alanları doldurun");
                  return;
                }
                handleCardCreate(virtualCard);
              }}
            >
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    alignItems: "center",
    flex: 1,
  },
  cardContainer: {
    position: "relative",
    width: 300,
    height: 500,
    marginTop: 80,
  },
  absoluteFill: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  fullSize: {
    width: "100%",
    height: "100%",
  },
  cardFront: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "black",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardBack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    overflow: "hidden",
    backgroundColor: "white",
  },
  textInput: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: 24,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingVertical: 32,
    gap: "10%",
  },
  retryButton: {
    backgroundColor: "#ea580c",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});
