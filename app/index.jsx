import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-4">
      <Text className="text-3xl font-bold text-primary mb-4">PHOENIX</Text>
      <Text className="text-text-secondary text-center mb-8">
        Rise. Rebuild. Become.
      </Text>
      <Link href="/auth/login" asChild>
        <Pressable className="bg-primary px-8 py-3 rounded-full overflow-hidden active:opacity-80">
          <Text className="text-white font-semibold text-lg">Get Started</Text>
        </Pressable>
      </Link>
    </View>
  );
}
