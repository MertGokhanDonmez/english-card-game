import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type FlashCardProps = {
  backText: string;
  imageUri: string | ImageSourcePropType;
  canFlip?: boolean;
  index: number;
  scrollOffset: SharedValue<number>;
  onPress?: () => void;
};

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const cardWidth = Dimensions.get("window").width * 0.85;
export const cardHeight = (cardWidth / 3) * 5;

const FlashCard: React.FC<FlashCardProps> = ({
  imageUri,
  backText,
  canFlip = true,
  onPress,
  index,
  scrollOffset,
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
      position: "relative",
      width: cardWidth,
      height: cardHeight,
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
      width: cardWidth,
      height: cardHeight,
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

  const rConteinerStyle = useAnimatedStyle(() => {
    const activeIndex = scrollOffset.value / cardWidth;
    const paddingLeft = (windowWidth - cardWidth - 50) / 2;

    const translateX = interpolate(
      activeIndex,
      [index - 3, index - 2, index - 1, index, index + 1],
      [21, 14, 7, 0, -cardWidth - paddingLeft * 2],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      activeIndex,
      [index - 3, index - 2, index - 1, index],
      [0, 7, 14, 21],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      activeIndex,
      [index - 2, index - 1, index, index + 1],
      [0.8, 0.9, 1, 1.1],
      Extrapolation.CLAMP
    );

    return {
      left: paddingLeft,
      transform: [
        {
          translateX: scrollOffset.value + translateX,
        },
        {
          translateY: translateY,
        },
        // {
        //   scale: scale,
        // },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        [
          {
            zIndex: -index,
          },
          rConteinerStyle,
        ],
      ]}
    >
      <TouchableWithoutFeedback onPress={canFlip ? flipCard : undefined}>
        <Animated.View style={frontAnimatedStyle}>
          <View style={styles.cardFront}>
            <Image
              source={
                typeof imageUri === "string" ? { uri: imageUri } : imageUri
              }
              style={styles.cardImage}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={flipCard}>
        <Animated.View style={backAnimatedStyle}>
          <View style={styles.cardBack}>
            <Text style={styles.backText}>{backText}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  cardFront: {
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
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardBack: {
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
  backText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default FlashCard;
