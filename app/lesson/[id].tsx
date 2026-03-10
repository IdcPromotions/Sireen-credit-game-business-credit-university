import React, { useRef } from "react";
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
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getLessonById } from "@/data/lessons";
import { useGame } from "@/context/GameContext";
import Colors from "@/constants/colors";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { completedLessons, lessonScores, isPremium, hasUniversity, checkPremiumStatus } = useGame();

  React.useEffect(() => {
    checkPremiumStatus();
  }, []);
  const lesson = getLessonById(Number(id));
  const btnScale = useRef(new Animated.Value(1)).current;

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Mission not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorBack}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (lesson.isUniversity && !hasUniversity) {
    return (
      <View style={[styles.errorContainer, { gap: 16 }]}>
        <Feather name="lock" size={40} color={Colors.teal} />
        <Text style={[styles.errorText, { color: Colors.textPrimary, fontSize: 18 }]}>Business Credit University</Text>
        <Text style={[styles.errorText, { fontSize: 13, color: Colors.textSecondary, textAlign: "center", paddingHorizontal: 32 }]}>
          This module requires Business Credit University access. Payment coming soon.
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
        <Text style={[styles.errorText, { color: Colors.textPrimary, fontSize: 18 }]}>Premium Mission</Text>
        <Text style={[styles.errorText, { fontSize: 13, color: Colors.textSecondary, textAlign: "center", paddingHorizontal: 32 }]}>
          Subscribe to Repair Mode to access this mission. Subscriptions renew monthly.
        </Text>
        <TouchableOpacity onPress={() => router.replace("/upgrade")}>
          <Text style={[styles.errorBack, { color: Colors.gold }]}>Subscribe Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorBack}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompleted = completedLessons.includes(lesson.id);
  const score = lessonScores[lesson.id];
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const onPressIn = () => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () => Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.lessonNumBadge}>
          <Text style={styles.lessonNumText}>MISSION {lesson.id}</Text>
        </View>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Feather name="check-circle" size={16} color={Colors.success} />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
          {isCompleted && score !== undefined && (
            <View style={styles.scoreChip}>
              <Ionicons name="star" size={12} color={Colors.gold} />
              <Text style={styles.scoreChipText}>{score}% · Completed</Text>
            </View>
          )}
        </View>

        {/* Objective */}
        <View style={styles.objectiveCard}>
          <Text style={styles.objectiveLabel}>MISSION OBJECTIVE</Text>
          <Text style={styles.objectiveText}>{lesson.objective}</Text>
        </View>

        {/* Lesson Content */}
        {lesson.content.map((block, i) => {
          if (block.type === "heading") {
            return (
              <Text key={i} style={styles.contentHeading}>{block.text}</Text>
            );
          }
          if (block.type === "paragraph") {
            return (
              <Text key={i} style={styles.contentParagraph}>{block.text}</Text>
            );
          }
          if (block.type === "list" && block.items) {
            return (
              <View key={i} style={styles.contentList}>
                {block.items.map((item, j) => (
                  <View key={j} style={styles.listItem}>
                    <View style={styles.listDot} />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (block.type === "tip") {
            return (
              <View key={i} style={styles.tipCard}>
                <LinearGradient
                  colors={["#002233", "#001122"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Ionicons name="flash" size={16} color={Colors.teal} />
                <Text style={styles.tipText}>{block.text}</Text>
              </View>
            );
          }
          return null;
        })}

        {/* Key Terms */}
        {lesson.keyTerms && lesson.keyTerms.length > 0 && (
          <View style={styles.keyTermsSection}>
            <Text style={styles.keyTermsLabel}>KEY TERMS</Text>
            <View style={styles.keyTermsGrid}>
              {lesson.keyTerms.map((term, i) => (
                <View key={i} style={styles.keyTerm}>
                  <Text style={styles.keyTermText}>{term}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mission Tip */}
        <View style={styles.missionTipCard}>
          <View style={styles.missionTipHeader}>
            <Feather name="zap" size={14} color={Colors.gold} />
            <Text style={styles.missionTipLabel}>MISSION TIP</Text>
          </View>
          <Text style={styles.missionTipText}>{lesson.missionTip}</Text>
        </View>

        {/* CTA */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={styles.quizBtn}
            onPress={() => router.push({ pathname: "/quiz/[id]", params: { id: lesson.id } })}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isCompleted ? [Colors.tealDim, "#004466"] : [Colors.teal, "#007AA8"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <Text style={styles.quizBtnText}>
              {isCompleted ? "RETAKE CHECKPOINT" : "BEGIN CHECKPOINT"}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.quizNote}>80% required to advance · {lesson.quiz.length} questions</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.textSecondary },
  errorBack: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.teal, marginTop: 12 },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  backBtn: { padding: 4 },
  lessonNumBadge: {
    flex: 1,
    backgroundColor: Colors.tealDim + "44",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  lessonNumText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.teal,
    letterSpacing: 2,
  },
  completedBadge: { padding: 4 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },
  hero: { paddingVertical: 16 },
  lessonTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 6,
  },
  lessonSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 8,
  },
  scoreChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: Colors.goldDim,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scoreChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.gold,
  },
  objectiveCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  objectiveLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 6,
  },
  objectiveText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contentHeading: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.teal,
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  contentParagraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 23,
    marginBottom: 12,
  },
  contentList: { marginBottom: 12 },
  listItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  listDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.teal,
    marginTop: 7,
    flexShrink: 0,
  },
  listItemText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  tipCard: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.tealDim + "55",
    overflow: "hidden",
    alignItems: "flex-start",
  },
  tipText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.teal,
    lineHeight: 20,
  },
  keyTermsSection: { marginVertical: 16 },
  keyTermsLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 10,
  },
  keyTermsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  keyTerm: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keyTermText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  missionTipCard: {
    backgroundColor: Colors.goldDim + "33",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.goldDim,
  },
  missionTipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  missionTipLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 2,
  },
  missionTipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.gold,
    lineHeight: 21,
    fontStyle: "italic",
  },
  quizBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 17,
    gap: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  quizBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 1,
  },
  quizNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
});
