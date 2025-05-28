import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Octicons";
import { getAllItems } from "@/utils/storage";
import { useState, useEffect, useRef } from "react";
import { FlashCardType } from "@/src/types/flashCard";
import FlashCard, { cardWidth, windowWidth } from "@/src/components/FlashCard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/types/navigation";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";
import { Trans, useLingui } from "@lingui/react/macro";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const [cards, setCards] = useState<FlashCardType[]>([]);
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const animatedFlatRef = useAnimatedRef<Animated.FlatList<FlashCardType>>();
  const scrollViewOffset = useSharedValue(0);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const listPadding = windowWidth - cardWidth;
  const { t } = useLingui();

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
    // console.log("Fetched items ===------>>>>> ", items);

    const cardsArray = Object.values(items).filter(
      (item) => item && typeof item === "object" && "id" in item
    ) as FlashCardType[];
    setCards(cardsArray);
  };

  // useDerivedValue(() => {
  //   console.log("Scroll offset:", scrollViewOffset.value);
  // }, []);

  const shuffeledCards = () => {
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const handleShuffle = () => {
    const shuffled = shuffeledCards();
    console.log("Shuffled cards:", shuffled);

    setCards(shuffled);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <Trans>My Cards</Trans>
        </Text>
        {cards.length > 0 ? (
          <View style={[styles.scrollCardView]}>
            <Animated.FlatList
              data={[...cards].reverse()}
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
                    handleShuffle();
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
            <Text style={styles.emptyTextPrimary}>
              <Trans>No cards yet.</Trans>
            </Text>
            <Text style={styles.emptyTextSecondary}>
              <Trans>Add your first card!</Trans>
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Add")}
          style={styles.deleteButton}
        >
          <View style={styles.buttonContent}>
            <Icon name="dash" size={20} color="#3b82f6" />
            <Text style={styles.deleteButtonText}>
              <Trans>Delete</Trans>
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Add")}
          style={styles.addButton}
        >
          <View style={styles.buttonContent}>
            <Icon name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>
              <Trans>Add</Trans>
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 5,
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
    backgroundColor: "#3b82f6",
    borderWidth: 2,
    borderColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "white",
    borderColor: "#3b82f6",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButtonText: {
    color: "#3b82f6",
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    bottom: 0,
    paddingHorizontal: "10%",
    paddingBottom: "15%",
    position: "absolute",
  },
});
