import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter, Link } from "expo-router";

type Card = {
  id: string;
  word: string;
  imageUri: string;
};

export default function Home() {
  const router = useRouter();

  const cards: Card[] = [];

  const renderItem = ({ item }: { item: Card }) => (
    <Pressable
      className="p-3 my-2 bg-white rounded-lg"
      onPress={() =>
        router.push({ pathname: "/card/[id]", params: { id: item.id } })
      }
    >
      <Text numberOfLines={1} className="text-base">
        {item.word}
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 p-4 mt-16">
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text className="text-center mt-10 text-gray-500">No cards yet.</Text>
        }
      />

      <Link
        href="/add"
        className="absolute bottom-6 right-6 py-3 px-5 bg-blue-500 rounded-full"
      >
        <Text className="text-white text-base">+ Add Card</Text>
      </Link>
    </View>
  );
}
