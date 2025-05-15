import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/types/navigation";
import Icon from "react-native-vector-icons/Octicons";

type CheckedModalNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  visible: boolean;
  onClose: () => void;
  message?: string;
  onClear: () => void;
  onCardCreate: () => void;
  flipAnimation?: Animated.Value;
  setIsCardFlipped?: (value: boolean) => void;
};

export default function CheckedModal({
  visible,
  onClose,
  onClear,
  onCardCreate,
  flipAnimation,
  setIsCardFlipped,
}: Props) {
  const navigation = useNavigation<CheckedModalNavigationProp>();

  const handleClose = () => {
    onClear();
    onClose();
    onCardCreate();
  };

  const handleGoBack = () => {
    onCardCreate();
    onClear();
    onClose();
    setTimeout(() => {
      navigation.navigate("Home");
    }, 100);
  };

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.back(1.5),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Reset the card to front side
      if (flipAnimation && setIsCardFlipped) {
        flipAnimation.setValue(0);
        setIsCardFlipped(false);
      }
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible, flipAnimation, setIsCardFlipped]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animated.View
          style={[
            styles.modalView,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Icon name="check" size={40} color="white" />
          </View>

          <Text style={styles.modalTitle}>Success!</Text>
          <Text style={styles.modalMessage}>
            Your card has been successfully created.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Create Another</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={handleGoBack}
            >
              <Text style={styles.homeButtonText}>Go Home</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#34d399",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: "#f3f4f6",
  },
  homeButtonText: {
    color: "#6b7280",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
