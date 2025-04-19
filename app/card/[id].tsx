import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function Card() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Details</Text>
      <Text style={styles.word}>Word: </Text>
      <Image source={{ uri: "" }} style={styles.image} />
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Edit Card</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  word: {
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
