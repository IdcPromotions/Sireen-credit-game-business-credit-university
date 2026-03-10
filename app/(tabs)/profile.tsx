import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/colors";

const RANK_COLORS: Record<string, string> = {
  Rookie: "#78909C",
  Builder: "#4CAF50",
  Strategist: "#2196F3",
  Operator: "#9C27B0",
  Commander: "#FF9800",
  "Elite Restorer": "#D4AF37",
};

const RANK_DESCRIPTIONS: Record<string, string> = {
  Rookie: "Just entering the credit arena. Building awareness.",
  Builder: "Learning the fundamentals. Building the foundation.",
  Strategist: "Reading reports with precision. Developing dispute strategy.",
  Operator: "Executing disputes and negotiations. In active repair mode.",
  Commander: "Mastering escalation and advanced systems. Leading results.",
  "Elite Restorer": "Full system operator. Complete credit command achieved.",
};

function BadgeItem({ badge }: { badge: { id: string; name: string; icon: string; description: string; earned: boolean } }) {
  return (
    <View style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}>
      <View style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>
        <Feather
          name={badge.icon as any}
          size={20}
          color={badge.earned ? Colors.gold : Colors.textMuted}
        />
      </View>
      <Text style={[styles.badgeName, !badge.earned && styles.textMuted]} numberOfLines={2}>
        {badge.earned ? badge.name : "???"}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { xp, rank, completedLessons, lessonScores, badges, isPremium, getRankProgress, resetProgress } = useGame();
  const { user, logout } = useAuth();
  const rankProgress = getRankProgress();
  const rankColor = RANK_COLORS[rank] ?? Colors.gold;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const bestScore = Object.values(lessonScores).length > 0
    ? Math.max(...Object.values(lessonScores))
    : 0;

  const earnedBadges = badges.filter((b) => b.earned);

  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "This will erase all your XP, completed lessons, and badges. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetProgress },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROFILE</Text>
          {user && (
            <Text style={styles.headerEmail}>{user.email}</Text>
          )}
        </View>

        {/* Rank Card */}
        <View style={[styles.rankCard, { borderColor: rankColor + "55" }]}>
          <LinearGradient
            colors={[rankColor + "15", Colors.surface]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.rankCardInner}>
            <View style={[styles.rankRing, { borderColor: rankColor }]}>
              <Feather name="shield" size={36} color={rankColor} />
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankLabel}>CURRENT RANK</Text>
              <Text style={[styles.rankName, { color: rankColor }]}>{rank}</Text>
              <Text style={styles.rankDesc}>{RANK_DESCRIPTIONS[rank]}</Text>
            </View>
          </View>

          <View style={styles.xpSection}>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>XP</Text>
              <Text style={[styles.xpValue, { color: rankColor }]}>{xp}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${rankProgress.progress * 100}%`, backgroundColor: rankColor }]} />
            </View>
            {rankProgress.nextRank ? (
              <Text style={styles.nextRankText}>
                {rankProgress.next - rankProgress.current} XP to {rankProgress.nextRank}
              </Text>
            ) : (
              <Text style={[styles.nextRankText, { color: rankColor }]}>MAX RANK ACHIEVED</Text>
            )}
          </View>

          {isPremium && (
            <View style={styles.premiumBadge}>
              <Feather name="zap" size={12} color={Colors.gold} />
              <Text style={styles.premiumBadgeText}>PREMIUM OPERATOR</Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: Colors.tealDim }]}>
            <Text style={[styles.statValue, { color: Colors.teal }]}>{completedLessons.length}</Text>
            <Text style={styles.statLabel}>Missions{"\n"}Complete</Text>
          </View>
          <View style={[styles.statCard, { borderColor: Colors.goldDim }]}>
            <Text style={[styles.statValue, { color: Colors.gold }]}>{xp}</Text>
            <Text style={styles.statLabel}>Total{"\n"}XP Earned</Text>
          </View>
          <View style={[styles.statCard, { borderColor: Colors.successDim }]}>
            <Text style={[styles.statValue, { color: Colors.success }]}>{bestScore}%</Text>
            <Text style={styles.statLabel}>Best{"\n"}Quiz Score</Text>
          </View>
          <View style={[styles.statCard, { borderColor: Colors.border }]}>
            <Text style={[styles.statValue, { color: Colors.textPrimary }]}>{earnedBadges.length}</Text>
            <Text style={styles.statLabel}>Badges{"\n"}Earned</Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BADGES</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} />
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Feather name="info" size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            SIREEN CREDIT GAME is an educational credit literacy platform. It does not guarantee deletion of any account or any specific credit score outcome. Results depend on individual action.
          </Text>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Feather name="refresh-cw" size={14} color={Colors.danger} />
          <Text style={styles.resetText}>Reset Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive", onPress: logout },
            ]);
          }}
          testID="logout-button"
        >
          <Feather name="log-out" size={14} color={Colors.textSecondary} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },
  header: { paddingVertical: 16 },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: 3,
  },
  rankCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  rankCardInner: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  rankRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  rankInfo: { flex: 1 },
  rankLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 2,
  },
  rankName: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    letterSpacing: 1,
    marginBottom: 4,
  },
  rankDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  xpSection: { gap: 6 },
  xpRow: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: Colors.textMuted, letterSpacing: 1 },
  xpValue: { fontFamily: "Inter_700Bold", fontSize: 16 },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },
  nextRankText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "right",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: Colors.goldDim,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  premiumBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 14,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badgeItem: {
    width: "22%",
    alignItems: "center",
    gap: 6,
  },
  badgeItemLocked: { opacity: 0.4 },
  badgeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.goldDim,
  },
  badgeIconLocked: { borderColor: Colors.border },
  badgeName: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 13,
  },
  textMuted: { color: Colors.textMuted },
  disclaimerCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginBottom: 8,
  },
  resetText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.danger,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  headerEmail: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
