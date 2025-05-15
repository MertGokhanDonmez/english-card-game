import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/types/navigation";

type BackButtonProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function BackButton({ navigation }: BackButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.button}>
        <Icon name="chevron-left" size={25} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingLeft: 8,
  },
});
