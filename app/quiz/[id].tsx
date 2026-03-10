import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getLessonById } from "@/data/lessons";
import { useGame } from "@/context/GameContext";
import { apiRequest } from "@/lib/query-client";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

type QuizPhase = "question" | "review" | "submitting";

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = Math.abs(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function hashQuestionId(qId: string): number {
  let h = 0;
  for (let i = 0; i < qId.length; i++) {
    h = ((h << 5) - h + qId.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { completeLesson, isPremium, hasUniversity } = useGame();
  const lesson = getLessonById(Number(id));

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("question");
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correct: boolean[];
    xpEarned: number;
  } | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now());

  const progressAnim = useRef(new Animated.Value(0)).current;
  const optionScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setPhase("question");
    setResult(null);
    progressAnim.setValue(0);
    setShuffleSeed(Date.now());
  }, [id]);

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Quiz not found.</Text>
      </View>
    );
  }

  if (lesson.isUniversity && !hasUniversity) {
    return (
      <View style={[styles.errorContainer, { gap: 16 }]}>
        <Feather name="lock" size={40} color={Colors.teal} />
        <Text style={styles.errorText}>Business Credit University</Text>
        <Text style={[styles.errorText, { fontSize: 13, color: Colors.textSecondary }]}>
          This quiz requires BCU access. Payment coming soon.
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.errorBack, { color: Colors.teal }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (lesson.isPremium && !lesson.isUniversity && !isPremium) {
    return (
      <View style={[styles.errorContainer, { gap: 16 }]}>
        <Feather name="lock" size={40} color={Colors.gold} />
        <Text style={styles.errorText}>Premium Content</Text>
        <Text style={[styles.errorText, { fontSize: 13, color: Colors.textSecondary }]}>
          Unlock Repair Mode to access this quiz.
        </Text>
        <TouchableOpacity onPress={() => router.replace("/upgrade")}>
          <Text style={[styles.errorText, { color: Colors.gold }]}>Unlock Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const q = lesson.quiz[currentQ];
  const total = lesson.quiz.length;
  const progress = (currentQ + 1) / total;
  const shuffledOptions = seededShuffle(q.options, hashQuestionId(q.id) + shuffleSeed);

  const selectOption = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = [...answers, selectedOption];

    if (currentQ < total - 1) {
      setAnswers(newAnswers);
      setSelectedOption(null);
      setCurrentQ((q) => q + 1);
      Animated.timing(progressAnim, {
        toValue: (currentQ + 2) / total,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setAnswers(newAnswers);
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: string[]) => {
    setPhase("submitting");
    try {
      const res = await apiRequest("POST", "/api/grade-quiz", {
        lessonId: lesson.id,
        answers: finalAnswers,
      });
      const data = await res.json();
      setResult(data);
      completeLesson(lesson.id, data.score, data.xpEarned);
      setPhase("review");
      if (data.passed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (err) {
      console.error("Quiz grading failed:", err);
      setResult({ score: 0, passed: false, correct: finalAnswers.map(() => false), xpEarned: 0 });
      setPhase("review");
    }
  };

  if (phase === "submitting") {
    return (
      <View style={[styles.container, styles.center, { paddingTop: topPad }]}>
        <View style={styles.loadingCircle}>
          <Feather name="loader" size={32} color={Colors.teal} />
        </View>
        <Text style={styles.loadingText}>GRADING CHECKPOINT...</Text>
      </View>
    );
  }

  if (phase === "review" && result) {
    const passed = result.passed;
    const nextLesson = lesson.id + 1;
    const hasNext = getLessonById(nextLesson) !== undefined;

    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <ScrollView
          contentContainerStyle={[styles.reviewContent, { paddingBottom: bottomPad + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Result Header */}
          <View style={[styles.resultHeader, passed ? styles.resultPassed : styles.resultFailed]}>
            <LinearGradient
              colors={passed ? ["#003322", "#001A10"] : ["#330011", "#1A0008"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.resultIcon, { borderColor: passed ? Colors.success : Colors.danger }]}>
              <Ionicons
                name={passed ? "checkmark" : "close"}
                size={32}
                color={passed ? Colors.success : Colors.danger}
              />
            </View>
            <Text style={[styles.resultTitle, { color: passed ? Colors.success : Colors.danger }]}>
              {passed ? "CHECKPOINT CLEARED" : "CHECKPOINT FAILED"}
            </Text>
            <Text style={styles.resultScore}>{result.score}%</Text>
            {passed ? (
              <View style={styles.xpEarned}>
                <Ionicons name="star" size={14} color={Colors.gold} />
                <Text style={styles.xpEarnedText}>+{result.xpEarned} XP Earned</Text>
              </View>
            ) : (
              <Text style={styles.retryNote}>80% required to pass. Review the lesson and try again.</Text>
            )}
          </View>

          {/* Review Answers */}
          <Text style={styles.reviewLabel}>QUESTION REVIEW</Text>
          {lesson.quiz.map((q, i) => (
            <View key={q.id} style={[styles.reviewCard, result.correct[i] ? styles.reviewCorrect : styles.reviewWrong]}>
              <View style={styles.reviewCardHeader}>
                <View style={[styles.reviewBadge, { backgroundColor: result.correct[i] ? Colors.successDim : Colors.dangerDim }]}>
                  <Ionicons
                    name={result.correct[i] ? "checkmark" : "close"}
                    size={12}
                    color={result.correct[i] ? Colors.success : Colors.danger}
                  />
                </View>
                <Text style={styles.reviewQuestionNum}>Q{i + 1}</Text>
              </View>
              <Text style={styles.reviewQuestion}>{q.question}</Text>
              <Text style={[styles.reviewAnswer, { color: result.correct[i] ? Colors.success : Colors.danger }]}>
                {result.correct[i] ? "Correct" : "Incorrect"}: {answers[i]}
              </Text>
            </View>
          ))}

          {/* Actions */}
          {passed && hasNext ? (
            <TouchableOpacity
              style={styles.nextMissionBtn}
              onPress={() =>
                router.replace({
                  pathname: "/mission-complete",
                  params: {
                    lessonId: lesson.id,
                    score: result.score,
                    xpEarned: result.xpEarned,
                    nextLessonId: nextLesson,
                  },
                })
              }
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.teal, "#007AA8"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Text style={styles.nextMissionText}>MISSION COMPLETE</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          ) : passed ? (
            <TouchableOpacity
              style={styles.nextMissionBtn}
              onPress={() => router.replace("/(tabs)")}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.success, "#008855"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Text style={styles.nextMissionText}>MISSIONS COMPLETE</Text>
              <Ionicons name="trophy" size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.failedActions}>
              <TouchableOpacity
                style={styles.reviewLessonBtn}
                onPress={() => router.back()}
              >
                <Feather name="book-open" size={16} color={Colors.teal} />
                <Text style={styles.reviewLessonText}>Review Lesson</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => {
                  setCurrentQ(0);
                  setAnswers([]);
                  setSelectedOption(null);
                  setPhase("question");
                  setResult(null);
                  progressAnim.setValue(0);
                  setShuffleSeed(Date.now());
                }}
              >
                <LinearGradient
                  colors={[Colors.tealDim, "#004466"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Feather name="refresh-cw" size={16} color="#fff" />
                <Text style={styles.retryText}>Retry Checkpoint</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Question Phase
  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.progressArea}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {currentQ + 1} / {total}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.questionContent, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.questionTag}>CHECKPOINT · Q{currentQ + 1}</Text>
          <Text style={styles.questionText}>{q.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {shuffledOptions.map((option, i) => {
            const isSelected = selectedOption === option;
            const letter = ["A", "B", "C", "D"][i];
            return (
              <TouchableOpacity
                key={option}
                onPress={() => selectOption(option)}
                activeOpacity={0.8}
                style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
              >
                <View style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                  <Text style={[styles.optionLetterText, isSelected && styles.optionLetterTextSelected]}>
                    {letter}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.teal} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, !selectedOption && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!selectedOption}
          activeOpacity={0.85}
        >
          {selectedOption && (
            <LinearGradient
              colors={[Colors.teal, "#007AA8"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Text style={[styles.nextBtnText, !selectedOption && styles.nextBtnTextDisabled]}>
            {currentQ === total - 1 ? "SUBMIT" : "NEXT"}
          </Text>
          <Ionicons
            name={currentQ === total - 1 ? "checkmark" : "arrow-forward"}
            size={18}
            color={selectedOption ? "#fff" : Colors.textMuted}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.textSecondary },
  errorBack: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.tealDim,
  },
  loadingText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.teal,
    letterSpacing: 2,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  progressArea: { flex: 1, gap: 4 },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.teal,
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "right",
  },
  scroll: { flex: 1 },
  questionContent: { paddingHorizontal: 16, paddingTop: 8 },
  questionHeader: { marginBottom: 24 },
  questionTag: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.teal,
    letterSpacing: 2,
    marginBottom: 10,
  },
  questionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  optionsContainer: { gap: 10, marginBottom: 24 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  optionBtnSelected: {
    borderColor: Colors.teal,
    backgroundColor: Colors.tealDim + "22",
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionLetterSelected: {
    backgroundColor: Colors.tealDim,
    borderColor: Colors.teal,
  },
  optionLetterText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  optionLetterTextSelected: { color: Colors.teal },
  optionText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 21,
  },
  optionTextSelected: {
    fontFamily: "Inter_500Medium",
    color: Colors.textPrimary,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 17,
    gap: 8,
    overflow: "hidden",
    backgroundColor: Colors.border,
  },
  nextBtnDisabled: { backgroundColor: Colors.surface },
  nextBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 1,
  },
  nextBtnTextDisabled: { color: Colors.textMuted },
  // Review
  reviewContent: { paddingHorizontal: 16, paddingTop: 16 },
  resultHeader: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  resultPassed: { borderColor: Colors.successDim },
  resultFailed: { borderColor: Colors.dangerDim },
  resultIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  resultTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: 2,
  },
  resultScore: {
    fontFamily: "Inter_700Bold",
    fontSize: 48,
    color: Colors.textPrimary,
  },
  xpEarned: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.goldDim,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  xpEarnedText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.gold,
  },
  retryNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  reviewLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewCorrect: { borderColor: Colors.successDim },
  reviewWrong: { borderColor: Colors.dangerDim },
  reviewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reviewBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewQuestionNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  reviewQuestion: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  reviewAnswer: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  nextMissionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 17,
    gap: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  nextMissionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 1,
  },
  failedActions: { gap: 10, marginTop: 8 },
  reviewLessonBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.tealDim,
  },
  reviewLessonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.teal,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
    overflow: "hidden",
  },
  retryText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 1,
  },
});
