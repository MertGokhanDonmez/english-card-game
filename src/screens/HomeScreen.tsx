import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Octicons";
import { getAllItems } from "@/utils/storage";
import { useState, useEffect, useRef } from "react";
import { FlashCardType } from "@/types/flashCard";
import FlashCard, { cardWidth, windowWidth } from "@/components/FlashCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/types/navigation";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const [cards, setCards] = useState<FlashCardType[]>([]);
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const animatedFlatRef = useAnimatedRef<Animated.FlatList<FlashCardType>>();
  const scrollViewOffset = useSharedValue(0);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const listPadding = windowWidth - cardWidth;
  const lastEndReachedTime = useRef(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollViewOffset.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const items = await getAllItems();
    const cardsArray = Object.values(items).filter(
      (item) => item && typeof item === "object" && "id" in item
    ) as FlashCardType[];
    setCards(cardsArray);
  };

  // useDerivedValue(() => {
  //   console.log("Scroll offset:", scrollViewOffset.value);
  // }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Cards</Text>

        {cards.length > 0 ? (
          <View style={[styles.scrollCardView]}>
            <Animated.FlatList
              data={cards.reverse()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View>
                  <FlashCard
                    index={cards.length - 1 - index}
                    key={index}
                    imageUri={item.frontImage}
                    backText={item.backText}
                    scrollOffset={scrollViewOffset}
                  />
                </View>
              )}
              ref={animatedFlatRef}
              horizontal
              snapToInterval={cardWidth}
              decelerationRate={"fast"}
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                width: cardWidth * cards.length + listPadding,
              }}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              onEndReached={() => {
                if (animatedFlatRef.current) {
                  setTimeout(() => {
                    animatedFlatRef.current?.scrollToEnd();
                  }, 150);
                }
              }}
              style={{ paddingTop: 16 }}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="file" size={50} color="#ccc" />
            <Text style={styles.emptyTextPrimary}>No cards yet.</Text>
            <Text style={styles.emptyTextSecondary}>Add your first card!</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Add")}
        style={styles.addButton}
      >
        <View style={styles.buttonContent}>
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.buttonText}>Add Card</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollCardView: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyTextPrimary: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyTextSecondary: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 32,
    right: 16,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
