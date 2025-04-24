import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";

type Props = {
  visible: boolean;
  onClose: () => void;
  message?: string;
  onClear: () => void;
  onCardCreate: () => void;
};

export default function CheckedModal({
  visible,
  onClose,
  onClear,
  onCardCreate,
}: Props) {
  const router = useRouter();

  const handleClose = () => {
    onClear();
    onClose();
    onCardCreate();
  };

  const handleGoBack = () => {
    router.push("/");
    handleClose();
  };

  const scale = useRef(new Animated.Value(0)).current;

  const showTick = () => {
    scale.setValue(0);
    Animated.timing(scale, {
      toValue: 1,
      easing: Easing.bounce,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (visible) {
      showTick();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className={
          "flex-1 justify-center items-center bg-black bg-opacity-50 p-4"
        }
      >
        <View className={"bg-white rounded-2xl p-4 items-center w-80"}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Icon name="check-circle-fill" size={80} color="green" />
          </Animated.View>
          <Text className={"text-2xl font-semibold mt-4 text-center"}>
            Kart başarıyla oluşturuldu!
          </Text>
          <Text className={"text-lg mt-6 text-center"}>
            Bir kart daha oluşturmak ister misiniz?
          </Text>
          <View className={"flex-row gap-4"}>
            <TouchableOpacity
              onPress={handleClose}
              className={"bg-green-500 px-6 py-2 rounded-lg mt-6"}
            >
              <Text className={"text-white font-bold"}>Evet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGoBack}
              className={"bg-red-500 px-6 py-2 rounded-lg mt-6"}
            >
              <Text className={"text-white font-bold"}>Hayır</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
