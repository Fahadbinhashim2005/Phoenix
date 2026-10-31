import { View, Text } from 'react-native';

export default function TasksScreen() {
  return (
    <View className="flex-1 bg-background pt-16 px-6">
      <Text className="text-white text-3xl font-bold mb-6">Tasks</Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-muted text-lg text-center">Your task list will appear here.</Text>
      </View>
    </View>
  );
}
