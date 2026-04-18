import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Text, ThemeProvider } from "@rneui/themed";

import TrueFalseQuestion from "./components/TrueFalseQuestion";
import MultipleChoiceQuestion from "./components/MultipleChoiceQuestion";
import MultipleAnswerQuestion from "./components/MultipleAnswerQuestion";

const Stack = createNativeStackNavigator();


const SAMPLE_DATA = [
  {
    prompt: "This assignment is NOT for DIG4639 - Mobile Development.",
    type: "true-false",
    choices: ["False", "True"],
    correct: 0
  },
  {
    prompt: "When is Quiz App due?",
    type: "multiple-choice",
    choices: ["April 19", "April 18", "May 1", "It's already late!"],
    correct: 1
  },
  {
    prompt: "What are the UCF mascots?",
    type: "multiple-answer",
    choices: ["Citronaut", "Knightro", "Alligator", "Bull"],
    correct: [0, 1]
  },
  {
    prompt: "Are you enjoying this quiz?",
    type: "multiple-choice",
    choices: ["Nope!", "It's alright I guess.", "Of course!"],
    correct: 2
  },
  {
    prompt: "Straweberries are the best fruit.",
    type: "true-false",
    choices: ["False","True"],
    correct: 1
  }
];

function arraysEqualIgnoringOrder(a = [], b = []) {
  if (a.length !== b.length) return false;
  const aSorted = [...a].sort((x, y) => x - y);
  const bSorted = [...b].sort((x, y) => x - y);
  return aSorted.every((value, index) => value === bSorted[index]);
}

function isAnswerCorrect(question, selected) {
  if (question.type === "multiple-answer") {
    return arraysEqualIgnoringOrder(selected, question.correct);
  }
  return selected === question.correct;
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.centered}>
      <Text h3 style={styles.title}>
        Quiz App
      </Text>

      <Button
        title="Start Quiz"
        onPress={() =>
          navigation.replace("Question", {
            data: SAMPLE_DATA,
            index: 0,
            answers: [],
          })
        }
      />
    </View>
  );
}

export function Question({ route, navigation }) {
  const { data, index, answers = [] } = route.params;
  const question = data[index];

  const [selectedIndex, setSelectedIndex] = useState(
    question.type === "multiple-answer" ? [] : undefined
  );

  const canContinue =
    question.type === "multiple-answer"
      ? Array.isArray(selectedIndex) && selectedIndex.length > 0
      : selectedIndex !== undefined;

  const handleNext = () => {
    const updatedAnswers = [...answers, selectedIndex];

    if (index === data.length - 1) {
      navigation.replace("Summary", {
        data,
        answers: updatedAnswers,
      });
    } else {
      navigation.replace("Question", {
        data,
        index: index + 1,
        answers: updatedAnswers,
      });
    }
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case "true-false":
        return (
          <TrueFalseQuestion
            question={question}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        );

      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={question}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        );

      case "multiple-answer":
        return (
          <MultipleAnswerQuestion
            question={question}
            selectedIndexes={selectedIndex}
            setSelectedIndexes={setSelectedIndex}
          />
        );

      default:
        return <Text>Unsupported question type.</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.questionNumber}>Question {index + 1}</Text>

      {renderQuestionType()}

      <Button
        testID="next-question"
        title={index === data.length - 1 ? "Finish Quiz" : "Next Question"}
        disabled={!canContinue}
        onPress={handleNext}
      />
    </ScrollView>
  );
}

export function Summary({ route, navigation }) {
  const { data, answers } = route.params;

  const score = useMemo(() => {
    return data.reduce((total, question, i) => {
      return total + (isAnswerCorrect(question, answers[i]) ? 1 : 0);
    }, 0);
  }, [data, answers]);

  const renderChoice = (question, questionIndex, choice, choiceIndex) => {
    const userAnswer = answers[questionIndex];

    const isCorrectChoice = Array.isArray(question.correct)
      ? question.correct.includes(choiceIndex)
      : question.correct === choiceIndex;

    const wasChosen = Array.isArray(userAnswer)
      ? userAnswer.includes(choiceIndex)
      : userAnswer === choiceIndex;

    let textStyle = styles.choiceText;

    if (wasChosen && isCorrectChoice) {
      textStyle = [styles.choiceText, styles.boldChoice];
    } else if (wasChosen && !isCorrectChoice) {
      textStyle = [styles.choiceText, styles.strikeChoice];
    } else if (isCorrectChoice) {
      textStyle = [styles.choiceText, styles.correctChoice];
    }

    return (
      <Text key={choiceIndex} style={textStyle}>
        • {choice}
      </Text>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={styles.title}>
        Summary
      </Text>

      <Text testID="total" style={styles.score}>
        Total Score: {score} / {data.length}
      </Text>

      {data.map((question, questionIndex) => {
        const correct = isAnswerCorrect(question, answers[questionIndex]);

        return (
          <View key={questionIndex} style={styles.summaryCard}>
            <Text style={styles.summaryPrompt}>
              {questionIndex + 1}. {question.prompt}
            </Text>

            <Text style={correct ? styles.resultCorrect : styles.resultWrong}>
              {correct ? "Correct" : "Incorrect"}
            </Text>

            {question.choices.map((choice, choiceIndex) =>
              renderChoice(question, questionIndex, choice, choiceIndex)
            )}
          </View>
        );
      })}

      <Button
        title="Restart Quiz"
        onPress={() => navigation.replace("Home")}
      />
    </ScrollView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Question"
            component={Question}
            options={{ headerLeft: () => null }}
          />
          <Stack.Screen
            name="Summary"
            component={Summary}
            options={{ headerLeft: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  title: {
    textAlign: "center",
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  summaryPrompt: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultCorrect: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "green"
  },
  resultWrong: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "red"
  },
  choiceText: {
    fontSize: 15,
    marginBottom: 4,
  },
  boldChoice: {
    fontWeight: "bold",
  },
  strikeChoice: {
    textDecorationLine: "line-through"
  },
  correctChoice: {}
});