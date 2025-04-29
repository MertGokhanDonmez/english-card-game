import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

type FlashCardProps = {
  backText: string;
  imageUri: string | ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const FlashCard: React.FC<FlashCardProps> = ({
  imageUri,
  backText,
  containerStyle,
  onPress,
}) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          perspective: 1000,
        },
        {
          rotateY: `${rotation.value}deg`,
        },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          perspective: 1000,
        },
        {
          rotateY: `${rotation.value + 180}deg`,
        },
      ],
      backfaceVisibility: "hidden",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: isCardFlipped ? 10 : 0,
    };
  });

  const flipCard = () => {
    const newValue = isCardFlipped ? 0 : 180;
    rotation.value = withSpring(newValue, {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    });
    setIsCardFlipped(!isCardFlipped);
    onPress?.();
  };

  return (
    <View className="items-center flex-1">
      <TouchableOpacity
        className="relative w-[300px] h-[500px] mt-20"
        onPress={flipCard}
        activeOpacity={0.9}
      >
        <Animated.View style={frontAnimatedStyle}>
          <View className="w-full h-full rounded-2xl border-2 border-black overflow-hidden">
            <Image
              source={
                typeof imageUri === "string" ? { uri: imageUri } : imageUri
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        <Animated.View style={backAnimatedStyle}>
          <View className="w-full h-full rounded-2xl items-center justify-center border-2 border-black overflow-hidden bg-white">
            <Text className="text-2xl font-semibold text-center px-4">
              {backText}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FlashCard;
