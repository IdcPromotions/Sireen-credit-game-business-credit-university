import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/context/GameContext";
import { LESSONS } from "@/data/lessons";
import { BCU_LESSONS } from "@/data/bcu-lessons";
import Colors from "@/constants/colors";

const logoImage = require("@/assets/images/logo.png");

const RANK_COLORS: Record<string, string> = {
  Rookie: "#78909C",
  Builder: "#4CAF50",
  Strategist: "#2196F3",
  Operator: "#9C27B0",
  Commander: "#FF9800",
  "Elite Restorer": "#D4AF37",
};

function MissionCard({ lesson, isLocked, isCompleted, score, lockType }: {
  lesson: typeof LESSONS[0];
  isLocked: boolean;
  isCompleted: boolean;
  score?: number;
  lockType?: "premium" | "university";
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  const handlePress = () => {
    if (isLocked && lockType === "premium") {
      router.push("/upgrade");
    } else if (isLocked && lockType === "university") {
      return;
    } else if (!isLocked) {
      router.push({ pathname: "/lesson/[id]", params: { id: lesson.id } });
    }
  };

  const tagLabel = lockType === "university" ? "BCU" : "PREMIUM";
  const tagBg = lockType === "university" ? "#1A3A5C" : Colors.goldDim;
  const tagText = lockType === "university" ? Colors.teal : Colors.gold;

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={[styles.missionCard, isCompleted && styles.missionCardCompleted, isLocked && styles.missionCardLocked]}>
          <View style={styles.missionLeft}>
            <View style={[styles.missionNumber, isCompleted && styles.missionNumberDone, isLocked && styles.missionNumberLocked]}>
              {isCompleted ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : isLocked ? (
                <Feather name="lock" size={14} color={Colors.textMuted} />
              ) : (
                <Text style={styles.missionNum}>{lesson.id > 100 ? lesson.id - 100 : lesson.id}</Text>
              )}
            </View>
          </View>
          <View style={styles.missionMiddle}>
            <Text style={[styles.missionTitle, isLocked && styles.textLocked]} numberOfLines={1}>
              {lesson.title}
            </Text>
            <Text style={[styles.missionSubtitle, isLocked && styles.textLocked]} numberOfLines={1}>
              {lesson.subtitle}
            </Text>
            {isCompleted && score !== undefined && (
              <View style={styles.scoreRow}>
                <Ionicons name="star" size={11} color={Colors.gold} />
                <Text style={styles.scoreText}>{score}% · {lesson.xpReward} XP</Text>
              </View>
            )}
            {!isCompleted && !isLocked && (
              <Text style={styles.xpHint}>+{lesson.xpReward} XP on pass</Text>
            )}
            {isLocked && (
              <View style={[styles.premiumTag, { backgroundColor: tagBg }]}>
                <Text style={[styles.premiumTagText, { color: tagText }]}>{tagLabel}</Text>
              </View>
            )}
          </View>
          <View style={styles.missionRight}>
            <Ionicons
              name={isLocked ? "lock-closed" : "chevron-forward"}
              size={18}
              color={isLocked ? Colors.textMuted : isCompleted ? Colors.success : Colors.teal}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const BCU_LEVELS = [
  { level: 1, name: "STARTUP", modules: [101, 102], badge: "Startup Badge" },
  { level: 2, name: "CREDIT IDENTITY", modules: [103, 104], badge: "Identity Badge" },
  { level: 3, name: "VENDOR BUILDER", modules: [105], badge: "Vendor Builder Badge" },
  { level: 4, name: "PAYDEX UNLOCKED", modules: [106], badge: "Credit Profile Badge" },
  { level: 5, name: "RETAIL CREDIT", modules: [107], badge: "Retail Power Badge" },
  { level: 6, name: "FLEET CREDIT", modules: [108], badge: "Fleet Operator Badge" },
  { level: 7, name: "CASH CREDIT", modules: [109], badge: "Funding Badge" },
  { level: 8, name: "FUNDING STACK", modules: [110], badge: "Capital Master Badge" },
  { level: 9, name: "SCALE", modules: [111], badge: "Growth Badge" },
  { level: 10, name: "ENTERPRISE", modules: [112], badge: "Enterprise Badge" },
];

export default function MissionsScreen() {
  const insets = useSafeAreaInsets();
  const { completedLessons, lessonScores, rank, xp, isPremium, hasUniversity, premiumDaysLeft, checkPremiumStatus, getRankProgress } = useGame();

  React.useEffect(() => {
    checkPremiumStatus();
  }, []);
  const rankProgress = getRankProgress();
  const rankColor = RANK_COLORS[rank] ?? Colors.gold;

  const freeLessons = LESSONS.filter((l) => !l.isPremium);
  const premiumLessons = LESSONS.filter((l) => l.isPremium);

  const bcuCompleted = BCU_LESSONS.filter((l) => completedLessons.includes(l.id)).length;
  const currentBcuLevel = BCU_LEVELS.reduce((lvl, l) => {
    const allDone = l.modules.every((id) => completedLessons.includes(id));
    return allDone ? l.level : lvl;
  }, 0);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
          <View style={[styles.rankBadge, { borderColor: rankColor }]}>
            <Text style={[styles.rankBadgeText, { color: rankColor }]}>{rank}</Text>
          </View>
        </View>

        {/* XP Bar */}
        <View style={styles.xpCard}>
          <LinearGradient
            colors={["#1C2744", "#111827"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.xpTop}>
            <View>
              <Text style={styles.xpLabel}>TOTAL XP</Text>
              <Text style={styles.xpValue}>{xp} <Text style={styles.xpUnit}>pts</Text></Text>
            </View>
            <View style={styles.xpRight}>
              <Text style={styles.xpMissions}>{completedLessons.filter((id) => id <= 18).length}/18</Text>
              <Text style={styles.xpMissionsLabel}>missions</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${rankProgress.progress * 100}%`, backgroundColor: rankColor }]} />
          </View>
          <View style={styles.rankRow}>
            <Text style={[styles.rankCurrent, { color: rankColor }]}>{rank}</Text>
            {rankProgress.nextRank && (
              <Text style={styles.rankNext}>→ {rankProgress.nextRank} ({rankProgress.next - rankProgress.current} XP away)</Text>
            )}
          </View>
        </View>

        {/* Bootcamp Mode */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTag}>
            <Text style={styles.sectionTagText}>FREE</Text>
          </View>
          <Text style={styles.sectionTitle}>BOOTCAMP MODE</Text>
          <Text style={styles.sectionDesc}>Master the fundamentals</Text>
        </View>

        {freeLessons.map((lesson) => (
          <MissionCard
            key={lesson.id}
            lesson={lesson}
            isLocked={false}
            isCompleted={completedLessons.includes(lesson.id)}
            score={lessonScores[lesson.id]}
          />
        ))}

        {/* Repair Mode */}
        <View style={[styles.sectionHeader, styles.sectionHeaderPremium]}>
          <View style={[styles.sectionTag, styles.sectionTagPremium]}>
            <Text style={styles.sectionTagText}>PREMIUM</Text>
          </View>
          <Text style={styles.sectionTitle}>REPAIR MODE</Text>
          <Text style={styles.sectionDesc}>Advanced dispute & rebuild systems</Text>
        </View>

        {isPremium && premiumDaysLeft !== null && (
          <TouchableOpacity
            style={[styles.subStatusCard, premiumDaysLeft <= 7 && styles.subStatusCardWarning]}
            onPress={() => router.push("/upgrade")}
            activeOpacity={0.85}
          >
            <Feather name={premiumDaysLeft <= 7 ? "alert-triangle" : "check-circle"} size={16} color={premiumDaysLeft <= 7 ? Colors.gold : Colors.success} />
            <Text style={[styles.subStatusText, premiumDaysLeft <= 7 && styles.subStatusTextWarning]}>
              {premiumDaysLeft === 0
                ? "Subscription expires today!"
                : premiumDaysLeft <= 7
                  ? `${premiumDaysLeft} day${premiumDaysLeft === 1 ? "" : "s"} left — tap to renew`
                  : `${premiumDaysLeft} days remaining`}
            </Text>
          </TouchableOpacity>
        )}

        {!isPremium && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => router.push("/upgrade")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#2D1F00", "#1A1200"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.upgradeCardInner}>
              <Ionicons name="lock-open" size={24} color={Colors.gold} />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>Unlock Repair Mode</Text>
                <Text style={styles.upgradeDesc}>13 advanced missions · Monthly subscription</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gold} />
            </View>
          </TouchableOpacity>
        )}

        {premiumLessons.map((lesson) => (
          <MissionCard
            key={lesson.id}
            lesson={lesson}
            isLocked={!isPremium}
            isCompleted={isPremium && completedLessons.includes(lesson.id)}
            score={lessonScores[lesson.id]}
            lockType="premium"
          />
        ))}

        {/* Business Credit University */}
        <View style={[styles.sectionHeader, styles.sectionHeaderPremium, { marginTop: 32 }]}>
          <View style={[styles.sectionTag, { backgroundColor: hasUniversity ? "#0D3D30" : "#1A3A5C" }]}>
            <Text style={styles.sectionTagText}>{hasUniversity ? "UNLOCKED" : "LOCKED"}</Text>
          </View>
          <View style={styles.bcuHeaderRow}>
            <Feather name="book-open" size={20} color={Colors.teal} />
            <Text style={styles.sectionTitle}>BUSINESS CREDIT UNIVERSITY</Text>
          </View>
          <Text style={styles.sectionDesc}>12 modules · Build business credit from scratch</Text>
        </View>

        {hasUniversity && (
          <View style={styles.bcuProgressCard}>
            <LinearGradient
              colors={["#1C2744", "#111827"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.bcuProgressTop}>
              <View>
                <Text style={styles.xpLabel}>LEVEL</Text>
                <Text style={[styles.xpValue, { color: Colors.teal }]}>
                  {currentBcuLevel}
                  <Text style={styles.xpUnit}>/10</Text>
                </Text>
              </View>
              <View style={styles.xpRight}>
                <Text style={styles.xpMissions}>{bcuCompleted}/12</Text>
                <Text style={styles.xpMissionsLabel}>modules</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(bcuCompleted / 12) * 100}%`, backgroundColor: Colors.teal }]} />
            </View>
            {currentBcuLevel > 0 && currentBcuLevel <= 10 && (
              <Text style={styles.bcuLevelName}>
                {BCU_LEVELS[currentBcuLevel - 1].badge}
              </Text>
            )}
          </View>
        )}

        {!hasUniversity && (
          <View style={styles.bcuLockedCard}>
            <LinearGradient
              colors={["#1A2A3C", "#0D1520"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.bcuLockedInner}>
              <Ionicons name="lock-closed" size={28} color={Colors.textMuted} />
              <View style={styles.upgradeText}>
                <Text style={styles.bcuLockedTitle}>Coming Soon</Text>
                <Text style={styles.upgradeDesc}>Payment integration pending</Text>
              </View>
            </View>
          </View>
        )}

        {BCU_LESSONS.map((lesson) => (
          <MissionCard
            key={lesson.id}
            lesson={lesson}
            isLocked={!hasUniversity}
            isCompleted={hasUniversity && completedLessons.includes(lesson.id)}
            score={lessonScores[lesson.id]}
            lockType="university"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  logoImage: {
    height: 44,
    width: 180,
  },
  rankBadge: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  rankBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 1,
  },
  xpCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  xpTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  xpLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 2,
  },
  xpValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: Colors.gold,
  },
  xpUnit: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
  },
  xpRight: { alignItems: "flex-end" },
  xpMissions: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.textPrimary,
  },
  xpMissionsLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rankCurrent: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 1,
  },
  rankNext: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeaderPremium: {
    marginTop: 24,
  },
  sectionTag: {
    backgroundColor: Colors.tealDim,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  sectionTagPremium: {
    backgroundColor: Colors.goldDim,
  },
  sectionTagText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#fff",
    letterSpacing: 2,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  sectionDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  missionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  missionCardCompleted: {
    borderColor: Colors.successDim,
    backgroundColor: "#0D1F17",
  },
  missionCardLocked: {
    opacity: 0.6,
  },
  missionLeft: {
    marginRight: 12,
  },
  missionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.tealDim,
    alignItems: "center",
    justifyContent: "center",
  },
  missionNumberDone: {
    backgroundColor: Colors.successDim,
  },
  missionNumberLocked: {
    backgroundColor: Colors.border,
  },
  missionNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.teal,
  },
  missionMiddle: { flex: 1 },
  missionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  missionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textLocked: {
    color: Colors.textMuted,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  scoreText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.gold,
  },
  xpHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 3,
  },
  premiumTag: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: Colors.goldDim,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumTagText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 1,
  },
  missionRight: { paddingLeft: 8 },
  subStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.tealDim + "33",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.teal + "33",
  },
  subStatusCardWarning: {
    backgroundColor: Colors.goldDim + "33",
    borderColor: Colors.gold + "44",
  },
  subStatusText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.teal,
  },
  subStatusTextWarning: {
    color: Colors.gold,
  },
  upgradeCard: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.goldDim,
  },
  upgradeCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  upgradeText: { flex: 1 },
  upgradeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.gold,
    marginBottom: 3,
  },
  upgradeDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bcuHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bcuProgressCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.teal + "44",
  },
  bcuProgressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  bcuLevelName: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.teal,
    letterSpacing: 1,
    marginTop: 6,
  },
  bcuLockedCard: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bcuLockedInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  bcuLockedTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 3,
  },
});
