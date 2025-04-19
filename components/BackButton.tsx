// components/BackButton.tsx
import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type BackButtonProps = {
  label?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export default function BackButton({
  label = "Back",
  buttonStyle,
  textStyle,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={[styles.button, buttonStyle]}
    >
      <Ionicons name="arrow-back" size={20} style={styles.icon} />
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#0284C7",
    borderRadius: 4,
  },
  icon: {
    color: "#fff",
    marginRight: 4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
