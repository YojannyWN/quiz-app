import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, ButtonGroup } from "@rneui/themed";

export default function MultipleAnswerQuestion({
  question,
  selectedIndexes,
  setSelectedIndexes,
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
        selectMultiple
        selectedIndexes={selectedIndexes}
        onPress={(value) => setSelectedIndexes(value)}
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