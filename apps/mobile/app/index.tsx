import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.eyebrow}>
            <Text style={styles.eyebrowText}>LAYERA</Text>
          </View>

          <View style={styles.copy}>
            <Text accessibilityRole="header" style={styles.title}>
              Understand what is in your routine.
            </Text>
            <Text style={styles.description}>
              Scan the ingredient label you own, verify the result, and build a calmer skincare
              routine.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scan your first skincare product"
            disabled
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              styles.primaryButtonDisabled,
            ]}>
            <Text style={styles.primaryButtonText}>Scan your first product</Text>
          </Pressable>
          <Text style={styles.foundationNote}>Project foundation ready · Scan flow coming next</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  eyebrowText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  copy: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1.4,
    lineHeight: 48,
  },
  description: {
    color: colors.textMuted,
    fontSize: 18,
    lineHeight: 27,
  },
  actions: {
    gap: spacing.md,
  },
  primaryButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '700',
  },
  foundationNote: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
