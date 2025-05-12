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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type FlashCardProps = {
  backText: string;
  imageUri: string | ImageSourcePropType;
  canFlip?: boolean;
  index: number;
  onPress?: () => void;
};

export const cardWidth = Dimensions.get("window").width * 0.85;
export const cardHeight = (cardWidth / 3) * 5;

const FlashCard: React.FC<FlashCardProps> = ({
  imageUri,
  backText,
  canFlip = true,
  onPress,
  index,
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

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          zIndex: -index,
          transform: [
            {
              translateX: index * 20,
            },
          ],
        },
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
