import { View, Text, Pressable } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Octicons";
import { getAllItems } from "@/utils/storage";
import { useState, useEffect } from "react";
import { FlashCardType } from "@/types/flashCard";
import FlashCard from "@/components/FlashCard";

export default function Home() {
  const router = useRouter();
  const [cards, setCards] = useState<FlashCardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const items = await getAllItems();
    const cardsArray = Object.values(items).filter(
      (item) => item && typeof item === "object" && "id" in item
    ) as FlashCardType[];
    setCards(cardsArray);
    console.log("Fetched cards:", cardsArray);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const currentCard = cards[currentCardIndex];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">My Cards</Text>

        {cards.length > 0 ? (
          <View className="flex-1 items-center">
            <FlashCard
              imageUri={currentCard.frontImage}
              backText={currentCard.backText}
            />

            <View className="flex-row justify-center gap-4 mt-8">
              <Pressable
                onPress={handlePreviousCard}
                disabled={currentCardIndex === 0}
                className={`p-4 rounded-full ${
                  currentCardIndex === 0 ? "bg-gray-300" : "bg-blue-500"
                }`}
              >
                <Icon name="chevron-left" size={24} color="white" />
              </Pressable>

              <Text className="text-lg font-semibold self-center">
                {currentCardIndex + 1} / {cards.length}
              </Text>

              <Pressable
                onPress={handleNextCard}
                disabled={currentCardIndex === cards.length - 1}
                className={`p-4 rounded-full ${
                  currentCardIndex === cards.length - 1
                    ? "bg-gray-300"
                    : "bg-blue-500"
                }`}
              >
                <Icon name="chevron-right" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="items-center justify-center flex-1">
            <Icon name="file" size={50} color="#ccc" />
            <Text className="text-center mt-4 text-gray-500">
              No cards yet.
            </Text>
            <Text className="text-center text-gray-400">
              Add your first card!
            </Text>
          </View>
        )}
      </View>

      <Link
        href="/add"
        className="absolute bottom-6 right-6 py-3 px-5 bg-blue-500 rounded-full shadow-lg"
      >
        <View className="flex-row items-center gap-2">
          <Icon name="plus" size={20} color="white" />
          <Text className="text-white text-base">Add Card</Text>
        </View>
      </Link>
    </SafeAreaView>
  );
}
