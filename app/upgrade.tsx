import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/query-client";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

const logoImage = require("@/assets/images/logo.png");

const FEATURES = [
  { icon: "layers", label: "13 Advanced Repair Missions", desc: "Lessons 6–18 unlocked" },
  { icon: "shield", label: "Collections Attack Mode", desc: "FDCPA-based challenge strategies" },
  { icon: "zap", label: "Charge-Off Attack Mode", desc: "Verification, DOFD, and escalation" },
  { icon: "trending-up", label: "Escalation & Compliance", desc: "MOV requests, CFPB complaints" },
  { icon: "activity", label: "Credit Rebuild System", desc: "Score growth strategy and tactics" },
  { icon: "calendar", label: "60-Day Execution Plan", desc: "Week-by-week structured action" },
  { icon: "award", label: "Final Boss Mission", desc: "Full credit repair system integration" },
];

export default function UpgradeScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium, premiumDaysLeft, checkPremiumStatus } = useGame();
  const { refreshUser } = useAuth();
  const btnScale = useRef(new Animated.Value(1)).current;
  const [purchasing, setPurchasing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPurchasing(true);
    try {
      const res = await apiRequest("POST", "/api/subscribe/repair");
      const data = await res.json();
      if (data.url) {
        await WebBrowser.openBrowserAsync(data.url);
        await refreshUser();
      }
    } catch (err: any) {
      Alert.alert("Unable to start checkout", "Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  if (isPremium) {
    const isExpiringSoon = premiumDaysLeft !== null && premiumDaysLeft <= 7;
    return (
      <View style={[styles.container, styles.center, { paddingTop: topPad }]}>
        <View style={styles.alreadyUnlocked}>
          <Ionicons name="checkmark-circle" size={48} color={isExpiringSoon ? Colors.gold : Colors.success} />
          <Text style={styles.unlockedTitle}>Repair Mode Active</Text>
          <Text style={styles.unlockedDesc}>You have full access to all 18 missions.</Text>
          {premiumDaysLeft !== null && (
            <View style={[styles.expiryBadge, isExpiringSoon && styles.expiryBadgeWarning]}>
              <Feather name={isExpiringSoon ? "alert-triangle" : "clock"} size={14} color={isExpiringSoon ? Colors.gold : Colors.teal} />
              <Text style={[styles.expiryText, isExpiringSoon && styles.expiryTextWarning]}>
                {premiumDaysLeft === 0
                  ? "Expires today — renew now!"
                  : premiumDaysLeft === 1
                    ? "1 day remaining — renew soon!"
                    : `${premiumDaysLeft} days remaining`}
              </Text>
            </View>
          )}
          {isExpiringSoon && (
            <TouchableOpacity
              style={styles.renewBtn}
              onPress={handleSubscribe}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.gold, "#B8860B"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Feather name="refresh-cw" size={16} color="#000" />
              <Text style={styles.renewBtnText}>RENEW SUBSCRIPTION</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeBtnText}>Continue Mission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <LinearGradient
        colors={["#0A0E1A", "#0D1520", "#0A0E1A"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Image source={logoImage} style={styles.heroLogo} resizeMode="contain" />
          <Text style={styles.heroTag}>UNLOCK THE FULL SYSTEM</Text>
          <Text style={styles.heroTitle}>Repair Mode</Text>
          <Text style={styles.heroSubtitle}>
            From audit to rebuild — every tool you need to execute a complete credit repair strategy.
          </Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceAmount}>$14.99</Text>
          <Text style={styles.pricePeriod}>/ month</Text>
          <Text style={styles.priceNote}>Auto-renews monthly. Cancel anytime.</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresLabel}>WHAT YOU UNLOCK</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Feather name={f.icon as any} size={18} color={Colors.gold} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            </View>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Learn the rules. Build the strategy. Repair the profile. Unlock the next level."
          </Text>
          <Text style={styles.quoteBrand}>— SIREEN CREDIT GAME</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[styles.unlockBtn, purchasing && { opacity: 0.6 }]}
            onPress={handleSubscribe}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.9}
            disabled={purchasing}
            testID="subscribe-repair"
          >
            <LinearGradient
              colors={[Colors.gold, "#B8860B"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            {purchasing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Feather name="credit-card" size={20} color="#000" />
                <Text style={styles.unlockBtnText}>SUBSCRIBE — $14.99/MO</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.secureRow}>
          <Feather name="lock" size={12} color={Colors.textMuted} />
          <Text style={styles.secureText}>Secure checkout powered by Stripe</Text>
        </View>

        <View style={styles.disclaimer}>
          <Feather name="info" size={12} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            SIREEN CREDIT GAME is an educational credit literacy platform. It does not guarantee deletion of any account or any specific credit score outcome.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backBtn: { padding: 8 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  heroSection: { alignItems: "center", paddingVertical: 28, gap: 12 },
  heroLogo: {
    width: 200,
    height: 80,
    marginBottom: 4,
  },
  heroTag: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 3,
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 23,
    maxWidth: 320,
  },
  priceCard: {
    alignItems: "center",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gold + "44",
    gap: 4,
  },
  priceAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 40,
    color: Colors.gold,
  },
  pricePeriod: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: Colors.textSecondary,
  },
  priceNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  featuresSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featuresLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.goldDim + "33",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.goldDim,
  },
  featureText: { flex: 1 },
  featureLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  featureDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  quoteCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.goldDim + "55",
    gap: 8,
  },
  quoteText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontStyle: "italic",
  },
  quoteBrand: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 2,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  unlockBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#000",
    letterSpacing: 1,
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  secureText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  disclaimer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    paddingBottom: 8,
  },
  disclaimerText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  alreadyUnlocked: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  unlockedTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.textPrimary,
  },
  unlockedDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.tealDim,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.teal + "44",
  },
  expiryBadgeWarning: {
    backgroundColor: Colors.goldDim + "44",
    borderColor: Colors.gold + "66",
  },
  expiryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.teal,
  },
  expiryTextWarning: {
    color: Colors.gold,
  },
  renewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  renewBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#000",
    letterSpacing: 1,
  },
  closeBtn: {
    backgroundColor: Colors.tealDim,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.teal + "44",
  },
  closeBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.teal,
  },
});
