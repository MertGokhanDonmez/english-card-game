import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from "react-native";

type FlashCardProps = {
  backText: string;
  imageUri?: string; // Opsiyonel prop
  containerStyle?: StyleProp<ViewStyle>; // Ek stil için
  onPress?: () => void; // Opsiyonel tıklama handler'ı
};

const FlashCard: React.FC<FlashCardProps> = ({
  imageUri,
  backText,
  containerStyle,
  onPress,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  return (
    <TouchableOpacity
      onPress={onPress || flipCard}
      activeOpacity={0.9}
      style={containerStyle}
    >
      <View className="perspective-1000">
        {/* Front */}
        <Animated.View
          className="w-72 h-96 bg-white rounded-xl p-4 justify-center items-center shadow-lg shadow-black/30"
          style={{
            transform: [{ rotateY: frontInterpolate }],
            backfaceVisibility: "hidden",
          }}
        >
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          )}
        </Animated.View>

        {/* Back */}
        <Animated.View
          className="w-72 h-96 bg-gray-100 rounded-xl p-6 absolute top-0 justify-center items-center"
          style={{
            transform: [{ rotateY: backInterpolate }],
            backfaceVisibility: "hidden",
          }}
        >
          <Text className="text-xl text-gray-800 text-center font-medium">
            {backText}
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default FlashCard;
