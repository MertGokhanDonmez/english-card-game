import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import BackButton from "../components/BackButton";
import { FlatList } from "react-native-gesture-handler";

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, "List">;

export default function ListScreen() {
  const navigation = useNavigation<ListScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <BackButton navigation={navigation} />

      <View style={styles.content}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>All Cards List</Text>
        </View>
        <View style={{}}>
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => (
              <View
                style={{
                  padding: 10,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                  borderColor: "#ddd",
                  borderWidth: 1,
                  marginVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Image
                  source={{ uri: "https://picsum.photos/300/500" }}
                  style={{ width: 33, height: 55, borderRadius: 6 }}
                />
                <Text style={{ fontSize: 20 }}>Back Text {item.index}</Text>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
