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

const bcuBannerImage = require("@/assets/images/bcu-banner.png");

const BCU_FEATURES = [
  { icon: "book-open", label: "12 Business Credit Modules", desc: "From startup to enterprise level" },
  { icon: "briefcase", label: "D-U-N-S & Bureau Setup", desc: "Establish your business identity" },
  { icon: "credit-card", label: "Vendor & Retail Credit", desc: "Build tradelines that report" },
  { icon: "truck", label: "Fleet & Cash Credit", desc: "Access vehicle and cash financing" },
  { icon: "bar-chart-2", label: "PAYDEX Score Mastery", desc: "Understand and improve your scores" },
  { icon: "shield", label: "Business Credit Disputes", desc: "Fix errors on business reports" },
  { icon: "trending-up", label: "Funding Stack Strategy", desc: "Stack approvals for maximum capital" },
  { icon: "award", label: "10-Level Progression", desc: "Startup to Enterprise rank system" },
];

export default function UpgradeUniversityScreen() {
  const insets = useSafeAreaInsets();
  const { hasUniversity, checkPremiumStatus } = useGame();
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
      const res = await apiRequest("POST", "/api/subscribe/university");
      const data = await res.json();
      if (data.url) {
        await WebBrowser.openBrowserAsync(data.url);
        await refreshUser();
        await checkPremiumStatus();
      }
    } catch (err: any) {
      Alert.alert("Unable to start checkout", "Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  if (hasUniversity) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: topPad }]}>
        <View style={styles.alreadyUnlocked}>
          <Ionicons name="checkmark-circle" size={48} color={Colors.teal} />
          <Text style={styles.unlockedTitle}>University Active</Text>
          <Text style={styles.unlockedDesc}>You have full access to all 12 Business Credit University modules.</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeBtnText}>Continue Learning</Text>
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
          <Image source={bcuBannerImage} style={styles.heroLogo} resizeMode="contain" />
          <Text style={styles.heroTag}>BUILD BUSINESS CREDIT FROM SCRATCH</Text>
          <Text style={styles.heroTitle}>Business Credit University</Text>
          <Text style={styles.heroSubtitle}>
            Master the complete business credit system — from D-U-N-S setup to stacking six-figure funding approvals.
          </Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceAmount}>$85.00</Text>
          <Text style={styles.pricePeriod}>/ month</Text>
          <Text style={styles.priceNote}>Auto-renews monthly. Cancel anytime.</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresLabel}>WHAT YOU UNLOCK</Text>
          {BCU_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Feather name={f.icon as any} size={18} color={Colors.teal} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color={Colors.teal} />
            </View>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Your personal credit got you started. Business credit gets you funded."
          </Text>
          <Text style={styles.quoteBrand}>— SIREEN BUSINESS CREDIT UNIVERSITY</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[styles.unlockBtn, purchasing && { opacity: 0.6 }]}
            onPress={handleSubscribe}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.9}
            disabled={purchasing}
            testID="subscribe-university"
          >
            <LinearGradient
              colors={[Colors.teal, "#0D7377"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="credit-card" size={20} color="#fff" />
                <Text style={styles.unlockBtnText}>SUBSCRIBE — $85.00/MO</Text>
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
            SIREEN BUSINESS CREDIT UNIVERSITY is an educational platform. Results depend on your business profile, actions taken, and market conditions.
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
  heroSection: { alignItems: "center", paddingVertical: 20, gap: 12 },
  heroLogo: {
    width: 260,
    height: 120,
    marginBottom: 4,
    borderRadius: 12,
  },
  heroTag: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.teal,
    letterSpacing: 3,
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.textPrimary,
    letterSpacing: 1,
    textAlign: "center",
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
    borderColor: Colors.teal + "44",
    gap: 4,
  },
  priceAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 40,
    color: Colors.teal,
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
    backgroundColor: Colors.tealDim + "33",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.tealDim,
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
    borderColor: Colors.tealDim + "55",
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
    color: Colors.teal,
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
    color: "#fff",
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
