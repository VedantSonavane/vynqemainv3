import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Svg,
  Circle
} from "@react-pdf/renderer";

import VynqeLogo from "./VynqeLogo";
import VMarkLogo from "./VMarkLogo";

Font.register({
  family: "Satoshi",
  fonts: [
    { src: "/src/Fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Regular.otf" },
    { src: "/src/Fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Bold.otf", fontWeight: "bold" }
  ]
});

/* ─────────────────────────────
   Dynamic Signal Dot
───────────────────────────── */

const SignalDot = ({ color }) => {

  const colors = {
    green: "#4CAF50",
    yellow: "#F6C832",
    red: "#E53935"
  };

  return (
    <Svg width="9" height="9">
      <Circle cx="4.5" cy="4.5" r="4.5" fill={colors[color] || "#4CAF50"} />
    </Svg>
  );
};

/* ─────────────────────────────
   Styles
───────────────────────────── */

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FDFBF0",
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: "Satoshi",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40
  },

  headerLeft: { flex: 1 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerRight: { flex: 1 },

  dateText: {
    fontSize: 10,
    color: "#777"
  },

  titleSection: {
    marginBottom: 40
  },

  titleLine: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#111"
  },

  subtitle: {
    fontSize: 13,
    marginTop: 10,
    color: "#555",
    fontWeight: "bold"
  },

  mainCard: {
    backgroundColor: "#F6C832",
    borderRadius: 36,
    paddingVertical: 30,
    paddingHorizontal: 30,
    width: "100%"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderWidth: 1.3,
    borderColor: "#E0C050"
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#D4820A",
    marginBottom: 12
  },

  badgeRow: {
    flexDirection: "row",
    marginBottom: 10
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 6
  },

  labelText: {
    fontSize: 11,
    color: "#777",
    marginBottom: 4
  },

  description: {
    fontSize: 10,
    color: "#555",
    lineHeight: 1.6
  },

  footerWrap: {
    marginTop: 20,
    alignItems: "center"
  },

  footer: {
    fontSize: 10,
    color: "#8A6F00"
  }
});

/* ─────────────────────────────
   Dynamic Stat Card
───────────────────────────── */

const EMPTY_SIGNAL = {
  title: "",
  badge: "",
  label: "",
  color: "green",
  description: "",
};

const StatCard = ({ signal }) => {
  const s = signal ?? EMPTY_SIGNAL;
  return (
    <View style={styles.statCard}>

      <Text style={styles.cardTitle}>
        {s.title}
      </Text>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {s.badge}
          </Text>
          <SignalDot color={s.color} />
        </View>
      </View>

      <Text style={styles.labelText}>
        {s.label}
      </Text>

      <Text style={styles.description}>
        {s.description}
      </Text>

    </View>
  );
};

/* ─────────────────────────────
   Ensure exactly 4 signals
───────────────────────────── */

const normaliseSignals = (signals) => {
  const base = Array.isArray(signals) ? signals : [];
  const padded = [...base];
  while (padded.length < 4) padded.push({ ...EMPTY_SIGNAL });
  return padded;
};

/* ─────────────────────────────
   Report
───────────────────────────── */

export const VynqeReport = ({ data }) => {

  const signals = normaliseSignals(data?.signals);

  return (
    <Document>

      <Page size="A4" style={styles.page} wrap={false}>

        {/* Header */}

        <View style={styles.header}>

          <View style={styles.headerLeft}>
            <Text style={styles.dateText}>{data.date}</Text>
          </View>

          <View style={styles.headerCenter}>
            <VynqeLogo />
          </View>

          <View style={styles.headerRight} />

        </View>

        {/* Title */}

        <View style={styles.titleSection}>

          <Text style={styles.titleLine}>Account</Text>
          <Text style={styles.titleLine}>Intelligence Report</Text>

          <Text style={styles.subtitle}>
            The signals you left behind point forward.
          </Text>

        </View>

        {/* Signal Cards */}

        <View style={styles.mainCard}>

          <View style={styles.row}>
            <StatCard signal={signals[0]} />
            <StatCard signal={signals[1]} />
          </View>

          <View style={styles.row}>
            <StatCard signal={signals[2]} />
            <StatCard signal={signals[3]} />
          </View>

          <View style={styles.footerWrap}>
            <Text style={styles.footer}>
              We would be pleased to continue the conversation
            </Text>
          </View>

        </View>

      </Page>

    </Document>
  );
};

export default VynqeReport;