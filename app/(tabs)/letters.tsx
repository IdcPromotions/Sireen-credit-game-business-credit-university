import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/query-client";
import { DISPUTE_LETTERS, getCategoryColor, type DisputeLetter } from "@/data/letters";
import Colors from "@/constants/colors";

const disputePacketImage = require("@/assets/images/dispute-packet.png");

const CATEGORIES = ["All", "Bureau", "Collector", "Creditor", "Escalation"] as const;

function LetterModal({ letter, onClose }: { letter: DisputeLetter; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const catColor = getCategoryColor(letter.category);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { paddingTop: topPad }]}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.modalHeaderText}>
            <Text style={styles.modalTitle} numberOfLines={1}>{letter.title}</Text>
            <View style={[styles.catTag, { backgroundColor: catColor + "22", borderColor: catColor + "44" }]}>
              <Text style={[styles.catTagText, { color: catColor }]}>{letter.category.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={[styles.modalContent, { paddingBottom: bottomPad + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalDesc}>{letter.description}</Text>
          <View style={styles.divider} />
          <Text style={styles.templateLabel}>TEMPLATE</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>{letter.template}</Text>
          </View>
          <View style={styles.instructionBox}>
            <Feather name="info" size={14} color={Colors.teal} />
            <Text style={styles.instructionText}>
              Replace all bracketed placeholders [like this] with your specific information before sending.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function LettersScreen() {
  const insets = useSafeAreaInsets();
  const { hasLetters } = useGame();
  const { refreshUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>("All");
  const [selectedLetter, setSelectedLetter] = useState<DisputeLetter | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const filtered = DISPUTE_LETTERS.filter(
    (l) => selectedCategory === "All" || l.category === selectedCategory
  );

  const handlePurchaseLetters = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPurchasing(true);
    try {
      const res = await apiRequest("POST", "/api/subscribe/letters");
      const data = await res.json();
      if (data.url) {
        await WebBrowser.openBrowserAsync(data.url);
        await refreshUser();
      }
    } catch {
      Alert.alert("Unable to open checkout", "Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  if (!hasLetters) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DISPUTE LETTERS</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.lockedScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.lockedContainer}>
            <Image source={disputePacketImage} style={styles.packetImage} resizeMode="contain" />
            <Text style={styles.lockedTitle}>Sireen Dispute Packet</Text>
            <Text style={styles.lockedPrice}>$50.00</Text>
            <Text style={styles.lockedDesc}>
              Get all 15 professional dispute letter templates covering bureau disputes, debt validation, settlements, and escalation strategies.
            </Text>
            <TouchableOpacity
              style={[styles.unlockBtn, purchasing && { opacity: 0.6 }]}
              onPress={handlePurchaseLetters}
              activeOpacity={0.85}
              disabled={purchasing}
              testID="purchase-letters"
            >
              {purchasing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Feather name="credit-card" size={16} color="#000" />
                  <Text style={styles.unlockBtnText}>Purchase Letter Packet</Text>
                </>
              )}
            </TouchableOpacity>
            <View style={styles.secureRow}>
              <Feather name="lock" size={12} color={Colors.textMuted} />
              <Text style={styles.secureText}>Secure checkout powered by Stripe</Text>
            </View>

            <View style={styles.previewList}>
              {DISPUTE_LETTERS.slice(0, 5).map((l) => (
                <View key={l.id} style={styles.previewItem}>
                  <Feather name="lock" size={12} color={Colors.textMuted} />
                  <Text style={styles.previewItemText}>{l.title}</Text>
                </View>
              ))}
              <Text style={styles.previewMore}>+ 10 more templates</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DISPUTE LETTERS</Text>
        <Text style={styles.headerSub}>{DISPUTE_LETTERS.length} templates</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.filterBtn, selectedCategory === cat && styles.filterBtnActive]}
          >
            <Text style={[styles.filterBtnText, selectedCategory === cat && styles.filterBtnTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((letter) => {
          const catColor = getCategoryColor(letter.category);
          return (
            <TouchableOpacity
              key={letter.id}
              style={styles.letterCard}
              onPress={() => setSelectedLetter(letter)}
              activeOpacity={0.8}
            >
              <View style={[styles.letterNumBadge, { backgroundColor: catColor + "22" }]}>
                <Text style={[styles.letterNumText, { color: catColor }]}>{letter.id}</Text>
              </View>
              <View style={styles.letterInfo}>
                <Text style={styles.letterTitle}>{letter.title}</Text>
                <Text style={styles.letterDesc} numberOfLines={2}>{letter.description}</Text>
                <View style={[styles.catChip, { backgroundColor: catColor + "22" }]}>
                  <Text style={[styles.catChipText, { color: catColor }]}>{letter.category}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedLetter && (
        <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: 3,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  filterScroll: { flexGrow: 0, marginBottom: 12 },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterBtnActive: {
    backgroundColor: Colors.tealDim,
    borderColor: Colors.teal,
  },
  filterBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  filterBtnTextActive: { color: Colors.teal },
  letterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  letterNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  letterNumText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  letterInfo: { flex: 1 },
  letterTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  letterDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 17,
  },
  catChip: {
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catChipText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  lockedScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  lockedContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
    paddingBottom: 40,
  },
  packetImage: {
    width: 280,
    height: 160,
    marginBottom: 4,
  },
  lockedTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.textPrimary,
  },
  lockedPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: Colors.gold,
  },
  secureRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  secureText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  lockedDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 4,
  },
  unlockBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#000",
  },
  previewList: { width: "100%", gap: 8, marginTop: 8 },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewItemText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  previewMore: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    paddingTop: 4,
  },
  // Modal
  modalContainer: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { padding: 4 },
  modalHeaderText: { flex: 1, gap: 6 },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  catTag: {
    alignSelf: "flex-start",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catTagText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  modalScroll: { flex: 1 },
  modalContent: { padding: 16 },
  modalDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  templateLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 10,
  },
  templateBox: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  templateText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  instructionBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.tealDim + "22",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.tealDim + "66",
  },
  instructionText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
