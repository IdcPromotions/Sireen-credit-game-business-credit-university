const C = {
  bg: "#0A0E1A",
  surface: "#111827",
  surfaceElevated: "#1C2744",
  border: "#2D3A52",
  borderLight: "#3D4F6E",

  gold: "#D4AF37",
  goldLight: "#E8C84A",
  goldDim: "#8A6F1E",

  teal: "#00C8FF",
  tealDim: "#0066CC",

  success: "#00D68F",
  successDim: "#004D33",

  danger: "#FF4757",
  dangerDim: "#5C0F18",

  warning: "#FFB347",

  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#546278",

  rankColors: {
    Rookie: "#78909C",
    Builder: "#4CAF50",
    Strategist: "#2196F3",
    Operator: "#9C27B0",
    Commander: "#FF9800",
    "Elite Restorer": "#D4AF37",
  },
} as const;

export default {
  light: {
    text: C.textPrimary,
    background: C.bg,
    tint: C.teal,
    tabIconDefault: C.textMuted,
    tabIconSelected: C.teal,
  },
  dark: {
    text: C.textPrimary,
    background: C.bg,
    tint: C.teal,
    tabIconDefault: C.textMuted,
    tabIconSelected: C.teal,
  },
  ...C,
};
