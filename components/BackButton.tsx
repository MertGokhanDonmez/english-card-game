// components/BackButton.tsx
import React from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Octicons";

export default function BackButton({}) {
  const router = useRouter();

  return (
    <View className="w-full flex-row items-center">
      <Pressable onPress={() => router.back()} className="pl-2">
        <Icon name="chevron-left" size={25} color="black" />
      </Pressable>
    </View>
  );
}
