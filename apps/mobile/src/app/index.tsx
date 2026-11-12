import { NETWORK_LABELS, SOCIAL_NETWORKS } from "@hypervivid/core";
import { colors, spacing } from "@hypervivid/ui";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Placeholder home screen until the mobile engineer builds the real one. */
export default function Home() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>HyperVivid</Text>
      <View style={styles.list}>
        {SOCIAL_NETWORKS.map((network) => (
          <Text key={network} style={styles.item}>
            {NETWORK_LABELS[network]}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.xl, backgroundColor: colors.surface },
  title: { fontSize: 28, fontWeight: "700", color: colors.brand },
  list: { marginTop: spacing.lg, gap: spacing.sm },
  item: { fontSize: 16, color: colors.text },
});
