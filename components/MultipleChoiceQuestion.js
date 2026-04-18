import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, ButtonGroup } from "@rneui/themed";

export default function MultipleChoiceQuestion({
  question,
  selectedIndex,
  setSelectedIndex,
}) {
  return (
    <View>
      <Text h4 style={styles.prompt}>
        {question.prompt}
      </Text>

      <ButtonGroup
        testID="choices"
        buttons={question.choices}
        vertical
        selectedIndex={selectedIndex}
        onPress={(value) => setSelectedIndex(value)}
        containerStyle={styles.groupContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: {
    marginBottom: 15,
  },
  groupContainer: {
    marginBottom: 20,
  },
});