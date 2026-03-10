import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getLessonById } from "@/data/lessons";
import { useGame } from "@/context/GameContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

const RANK_COLORS: Record<string, string> = {
  Rookie: "#78909C",
  Builder: "#4CAF50",
  Strategist: "#2196F3",
  Operator: "#9C27B0",
  Commander: "#FF9800",
  "Elite Restorer": "#D4AF37",
};

export default function MissionCompleteScreen() {
  const { lessonId, score, xpEarned, nextLessonId } = useLocalSearchParams<{
    lessonId: string;
    score: string;
    xpEarned: string;
    nextLessonId: string;
  }>();
  const insets = useSafeAreaInsets();
  const { rank, xp, getRankProgress, badges } = useGame();

  const lesson = getLessonById(Number(lessonId));
  const nextLesson = getLessonById(Number(nextLessonId));
  const rankColor = RANK_COLORS[rank] ?? Colors.gold;
  const rankProgress = getRankProgress();

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scaleIn = useRef(new Animated.Value(0.4)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const xpBarWidth = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const sequenceAnim = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleIn, { toValue: 1, speed: 6, bounciness: 12, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(xpBarWidth, {
        toValue: rankProgress.progress,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]);
    sequenceAnim.start();

    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.6, duration: 1200, useNativeDriver: true }),
      ])
    );
    loopAnim.start();

    return () => {
      sequenceAnim.stop();
      loopAnim.stop();
    };
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const earnedBadge = lesson?.badge
    ? badges.find((b) => b.name === lesson.badge && b.earned)
    : null;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <LinearGradient
        colors={["#0A0E1A", "#001A2C", "#0A0E1A"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        {/* Trophy Area */}
        <Animated.View
          style={[
            styles.trophyContainer,
            {
              transform: [{ scale: scaleIn }],
              opacity: glowPulse,
            },
          ]}
        >
          <View style={[styles.trophyRing, { borderColor: Colors.teal + "55" }]} />
          <View style={[styles.trophyRingInner, { borderColor: Colors.teal + "33" }]} />
          <View style={styles.trophyIcon}>
            <Ionicons name="trophy" size={48} color={Colors.teal} />
          </View>
        </Animated.View>

        {/* Mission Complete Label */}
        <Text style={styles.missionLabel}>MISSION COMPLETE</Text>
        <Text style={styles.missionTitle}>{lesson?.title ?? "Lesson Complete"}</Text>

        {/* Score */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardLabel}>SCORE</Text>
            <Text style={styles.scoreCardValue}>{score}%</Text>
          </View>
          <View style={[styles.scoreCard, styles.xpCard]}>
            <Text style={styles.scoreCardLabel}>XP EARNED</Text>
            <Text style={[styles.scoreCardValue, { color: Colors.gold }]}>+{xpEarned}</Text>
          </View>
        </View>

        {/* Rank Progress */}
        <View style={styles.rankSection}>
          <View style={styles.rankRow}>
            <Text style={[styles.rankName, { color: rankColor }]}>{rank}</Text>
            <Text style={styles.rankXp}>{xp} XP total</Text>
          </View>
          <View style={styles.rankBar}>
            <Animated.View
              style={[
                styles.rankBarFill,
                {
                  width: xpBarWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: rankColor,
                },
              ]}
            />
          </View>
          {rankProgress.nextRank && (
            <Text style={styles.nextRankText}>{rankProgress.next - rankProgress.current} XP to {rankProgress.nextRank}</Text>
          )}
        </View>

        {/* Badge Earned */}
        {earnedBadge && (
          <View style={styles.badgeEarned}>
            <View style={styles.badgeEarnedIcon}>
              <Feather name={earnedBadge.icon as any} size={20} color={Colors.gold} />
            </View>
            <View>
              <Text style={styles.badgeEarnedLabel}>BADGE UNLOCKED</Text>
              <Text style={styles.badgeEarnedName}>{earnedBadge.name}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {nextLesson && (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() =>
                router.replace({ pathname: "/lesson/[id]", params: { id: nextLesson.id } })
              }
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.teal, "#007AA8"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Text style={styles.nextBtnText}>NEXT MISSION</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.85}
          >
            <Feather name="grid" size={16} color={Colors.textSecondary} />
            <Text style={styles.homeBtnText}>Back to Missions</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 400,
  },
  trophyContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  trophyRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
  },
  trophyRingInner: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
  },
  trophyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.tealDim + "33",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.teal + "44",
  },
  missionLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.teal,
    letterSpacing: 3,
    marginBottom: 8,
  },
  missionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 20,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  xpCard: { borderColor: Colors.goldDim },
  scoreCardLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  scoreCardValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.textPrimary,
  },
  rankSection: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  rankXp: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  rankBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  rankBarFill: { height: 6, borderRadius: 3 },
  nextRankText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "right",
  },
  badgeEarned: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.goldDim + "44",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.goldDim,
  },
  badgeEarnedIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.goldDim,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.gold + "44",
  },
  badgeEarnedLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 2,
    marginBottom: 3,
  },
  badgeEarnedName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.gold,
  },
  actions: { width: "100%", gap: 10 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 17,
    gap: 8,
    overflow: "hidden",
  },
  nextBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 1,
  },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  homeBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
