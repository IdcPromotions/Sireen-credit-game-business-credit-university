import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

interface Category {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  maxPoints: number;
  options: { label: string; points: number }[];
}

const CATEGORIES: Category[] = [
  {
    key: "timeInBusiness",
    label: "Time in Business",
    icon: "time-outline",
    maxPoints: 15,
    options: [
      { label: "Less than 6 months", points: 2 },
      { label: "6–12 months", points: 5 },
      { label: "1–2 years", points: 8 },
      { label: "2–3 years", points: 11 },
      { label: "3–5 years", points: 13 },
      { label: "5+ years", points: 15 },
    ],
  },
  {
    key: "revenue",
    label: "Revenue",
    icon: "cash-outline",
    maxPoints: 15,
    options: [
      { label: "Under $5K/month", points: 2 },
      { label: "$5K–$10K/month", points: 5 },
      { label: "$10K–$25K/month", points: 8 },
      { label: "$25K–$50K/month", points: 11 },
      { label: "$50K–$100K/month", points: 13 },
      { label: "$100K+/month", points: 15 },
    ],
  },
  {
    key: "bankStability",
    label: "Bank Stability",
    icon: "business-outline",
    maxPoints: 15,
    options: [
      { label: "Frequent overdrafts / low balance", points: 2 },
      { label: "Avg balance under $1K, some NSFs", points: 5 },
      { label: "Avg balance $1K–$5K, stable", points: 8 },
      { label: "Avg balance $5K–$15K, no NSFs", points: 11 },
      { label: "Avg balance $15K–$50K, strong history", points: 13 },
      { label: "Avg balance $50K+, pristine record", points: 15 },
    ],
  },
  {
    key: "tradelineDepth",
    label: "Tradeline Depth",
    icon: "layers-outline",
    maxPoints: 12,
    options: [
      { label: "No tradelines reporting", points: 1 },
      { label: "1–2 tradelines, under 6 months", points: 3 },
      { label: "3–4 tradelines, 6–12 months avg", points: 6 },
      { label: "5–7 tradelines, 1–2 year avg", points: 8 },
      { label: "8–10 tradelines, 2+ year avg", points: 10 },
      { label: "10+ tradelines, 3+ year avg", points: 12 },
    ],
  },
  {
    key: "creditQuality",
    label: "Credit Quality",
    icon: "shield-checkmark-outline",
    maxPoints: 15,
    options: [
      { label: "Personal score under 550", points: 2 },
      { label: "Personal 550–619", points: 5 },
      { label: "Personal 620–679", points: 8 },
      { label: "Personal 680–719, some biz credit", points: 10 },
      { label: "Personal 720–779, PAYDEX 70+", points: 13 },
      { label: "Personal 780+, PAYDEX 80+", points: 15 },
    ],
  },
  {
    key: "utilizationDebt",
    label: "Utilization / Debt",
    icon: "pie-chart-outline",
    maxPoints: 12,
    options: [
      { label: "Over 80% utilization", points: 1 },
      { label: "60%–80% utilization", points: 3 },
      { label: "40%–60% utilization", points: 5 },
      { label: "25%–40% utilization", points: 7 },
      { label: "10%–25% utilization", points: 10 },
      { label: "Under 10% utilization", points: 12 },
    ],
  },
  {
    key: "publicRecord",
    label: "Public Records",
    icon: "document-text-outline",
    maxPoints: 8,
    options: [
      { label: "Active bankruptcy or judgment", points: 0 },
      { label: "Discharged bankruptcy (under 3 yrs)", points: 2 },
      { label: "Discharged bankruptcy (3–7 yrs)", points: 4 },
      { label: "Paid liens, no active derogatories", points: 6 },
      { label: "Clean — no public records", points: 8 },
    ],
  },
  {
    key: "identityCompliance",
    label: "Identity / Compliance",
    icon: "finger-print-outline",
    maxPoints: 8,
    options: [
      { label: "No EIN, unregistered business", points: 1 },
      { label: "EIN only, no D-U-N-S or website", points: 3 },
      { label: "EIN + D-U-N-S, basic website", points: 5 },
      { label: "EIN + D-U-N-S + dedicated phone + website", points: 7 },
      { label: "Full compliance (EIN, D-U-N-S, phone, site, license)", points: 8 },
    ],
  },
];

const SCORE_TIERS = [
  { min: 90, max: 100, approval: "85%–95%", color: "#00D68F", label: "Excellent" },
  { min: 75, max: 89, approval: "70%–84%", color: "#4CAF50", label: "Strong" },
  { min: 60, max: 74, approval: "50%–69%", color: "#FFB347", label: "Moderate" },
  { min: 40, max: 59, approval: "25%–49%", color: "#FF9800", label: "Developing" },
  { min: 0, max: 39, approval: "5%–24%", color: "#FF4757", label: "Early Stage" },
];

function getTier(score: number) {
  return SCORE_TIERS.find((t) => score >= t.min && score <= t.max) ?? SCORE_TIERS[4];
}

export default function FundingScoreScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const [selections, setSelections] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(CATEGORIES[0].key);
  const resultScale = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const totalScore = Object.values(selections).reduce((sum, v) => sum + v, 0);
  const maxScore = CATEGORIES.reduce((sum, c) => sum + c.maxPoints, 0);
  const answeredCount = Object.keys(selections).length;
  const allAnswered = answeredCount === CATEGORIES.length;

  const handleSelect = (categoryKey: string, points: number) => {
    setSelections((prev) => ({ ...prev, [categoryKey]: points }));
    const catIdx = CATEGORIES.findIndex((c) => c.key === categoryKey);
    if (catIdx < CATEGORIES.length - 1) {
      setTimeout(() => setExpandedCategory(CATEGORIES[catIdx + 1].key), 300);
    }
  };

  const handleCalculate = () => {
    setShowResult(true);
    resultScale.setValue(0);
    Animated.spring(resultScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 12,
    }).start();
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 100);
  };

  const handleReset = () => {
    setSelections({});
    setShowResult(false);
    setExpandedCategory(CATEGORIES[0].key);
    resultScale.setValue(0);
  };

  const tier = getTier(totalScore);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FUNDING SCORE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {showResult && (
          <Animated.View style={[styles.resultCard, { transform: [{ scale: resultScale }] }]}>
            <LinearGradient
              colors={["#1C2744", "#111827"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.resultScoreRow}>
              <View style={[styles.scoreCircle, { borderColor: tier.color }]}>
                <Text style={[styles.scoreNumber, { color: tier.color }]}>{totalScore}</Text>
                <Text style={styles.scoreMax}>/{maxScore}</Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultLabel, { color: tier.color }]}>{tier.label}</Text>
                <Text style={styles.resultApproval}>Approval Odds</Text>
                <Text style={[styles.resultApprovalValue, { color: tier.color }]}>{tier.approval}</Text>
              </View>
            </View>

            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>SCORE BREAKDOWN</Text>
            </View>
            {CATEGORIES.map((cat) => {
              const pts = selections[cat.key] ?? 0;
              const pct = cat.maxPoints > 0 ? (pts / cat.maxPoints) * 100 : 0;
              return (
                <View key={cat.key} style={styles.breakdownRow}>
                  <View style={styles.breakdownLeft}>
                    <Ionicons name={cat.icon} size={14} color={Colors.textSecondary} />
                    <Text style={styles.breakdownLabel} numberOfLines={1}>{cat.label}</Text>
                  </View>
                  <View style={styles.breakdownBarContainer}>
                    <View style={styles.breakdownBarBg}>
                      <View style={[styles.breakdownBarFill, { width: `${pct}%`, backgroundColor: pct >= 70 ? Colors.success : pct >= 40 ? Colors.warning : Colors.danger }]} />
                    </View>
                  </View>
                  <Text style={styles.breakdownPoints}>{pts}/{cat.maxPoints}</Text>
                </View>
              );
            })}

            <View style={styles.tierLegend}>
              {SCORE_TIERS.map((t) => (
                <View key={t.min} style={[styles.tierRow, totalScore >= t.min && totalScore <= t.max && styles.tierRowActive]}>
                  <View style={[styles.tierDot, { backgroundColor: t.color }]} />
                  <Text style={styles.tierRange}>{t.min}–{t.max}</Text>
                  <Text style={styles.tierApproval}>{t.approval}</Text>
                  <Text style={[styles.tierName, { color: t.color }]}>{t.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Feather name="refresh-cw" size={16} color={Colors.teal} />
              <Text style={styles.resetText}>Recalculate</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {!showResult && (
          <>
            <View style={styles.introCard}>
              <LinearGradient
                colors={["#1C2744", "#111827"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Feather name="target" size={24} color={Colors.gold} />
              <Text style={styles.introTitle}>Calculate Your Funding Score</Text>
              <Text style={styles.introDesc}>
                Answer 8 questions about your business to estimate your funding approval odds.
              </Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>{answeredCount}/{CATEGORIES.length} answered</Text>
                <View style={styles.progressBarSmall}>
                  <View style={[styles.progressFillSmall, { width: `${(answeredCount / CATEGORIES.length) * 100}%` }]} />
                </View>
              </View>
            </View>

            {CATEGORIES.map((cat, idx) => {
              const isExpanded = expandedCategory === cat.key;
              const isAnswered = selections[cat.key] !== undefined;
              const selectedPts = selections[cat.key];

              return (
                <View key={cat.key} style={[styles.categoryCard, isAnswered && styles.categoryCardAnswered]}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => setExpandedCategory(isExpanded ? null : cat.key)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryIcon, isAnswered && styles.categoryIconDone]}>
                        {isAnswered ? (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        ) : (
                          <Ionicons name={cat.icon} size={16} color={Colors.teal} />
                        )}
                      </View>
                      <View>
                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                        {isAnswered && (
                          <Text style={styles.categoryScore}>{selectedPts}/{cat.maxPoints} pts</Text>
                        )}
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.optionsList}>
                      {cat.options.map((opt) => {
                        const isSelected = selections[cat.key] === opt.points;
                        return (
                          <TouchableOpacity
                            key={opt.label}
                            style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                            onPress={() => handleSelect(cat.key, opt.points)}
                            activeOpacity={0.7}
                          >
                            <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                              {isSelected && <View style={styles.optionRadioDot} />}
                            </View>
                            <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{opt.label}</Text>
                            <Text style={[styles.optionPts, isSelected && styles.optionPtsSelected]}>{opt.points} pts</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}

            {allAnswered && (
              <TouchableOpacity style={styles.calcButton} onPress={handleCalculate} activeOpacity={0.85}>
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDim]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Feather name="zap" size={20} color="#000" />
                <Text style={styles.calcButtonText}>CALCULATE SCORE</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  scroll: { flex: 1 },
  introCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 8,
  },
  introTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  introDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    width: "100%",
  },
  progressLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    width: 80,
  },
  progressBarSmall: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFillSmall: {
    height: 4,
    backgroundColor: Colors.teal,
    borderRadius: 2,
  },
  categoryCard: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    overflow: "hidden",
  },
  categoryCardAnswered: {
    borderColor: Colors.successDim,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tealDim + "44",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconDone: {
    backgroundColor: Colors.successDim,
  },
  categoryLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.textPrimary,
  },
  categoryScore: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.success,
    marginTop: 1,
  },
  optionsList: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 10,
  },
  optionRowSelected: {
    backgroundColor: Colors.tealDim + "22",
  },
  optionRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioSelected: {
    borderColor: Colors.teal,
  },
  optionRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
  },
  optionLabel: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  optionLabelSelected: {
    color: Colors.textPrimary,
    fontFamily: "Inter_500Medium",
  },
  optionPts: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textMuted,
  },
  optionPtsSelected: {
    color: Colors.teal,
  },
  calcButton: {
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  calcButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#000",
    letterSpacing: 2,
  },
  resultCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
  },
  scoreMax: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -4,
  },
  resultInfo: { flex: 1 },
  resultLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    marginBottom: 4,
  },
  resultApproval: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  resultApprovalValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  breakdownHeader: { marginBottom: 12 },
  breakdownTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  breakdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 120,
  },
  breakdownLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  breakdownBarContainer: { flex: 1 },
  breakdownBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: 6,
    borderRadius: 3,
  },
  breakdownPoints: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.textPrimary,
    width: 36,
    textAlign: "right",
  },
  tierLegend: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    gap: 6,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tierRowActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tierRange: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
    width: 50,
  },
  tierApproval: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  tierName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.teal + "44",
  },
  resetText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.teal,
  },
});
