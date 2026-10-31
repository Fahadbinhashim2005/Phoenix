import { View, Text } from 'react-native';

export default function MoreScreen() {
  return (
    <View className="flex-1 bg-background pt-16 px-6">
      <Text className="text-white text-3xl font-bold mb-6">More</Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-muted text-lg text-center">Settings, Analytics, Notes, and more.</Text>
      </View>
    </View>
  );
}
