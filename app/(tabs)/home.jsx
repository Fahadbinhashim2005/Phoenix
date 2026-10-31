import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View className="flex-1 bg-background pt-16 px-6">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-text-secondary text-sm">Good morning,</Text>
          <Text className="text-white text-2xl font-bold">Fahad</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="bg-panel px-4 py-2 rounded-lg">
          <Text className="text-danger font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-surface rounded-2xl p-6 border border-panel-hover mb-6">
        <Text className="text-text-muted text-xs font-bold tracking-widest uppercase mb-2">Current Transformation</Text>
        <Text className="text-white text-xl font-bold mb-4">95 DAY JOURNEY</Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-secondary text-sm">Day 1 / 95</Text>
          <Text className="text-primary text-sm font-bold">1%</Text>
        </View>
        
        {/* Progress Bar */}
        <View className="h-2 w-full bg-panel rounded-full overflow-hidden">
          <View className="h-full bg-primary" style={{ width: '1%' }} />
        </View>
      </View>

      <Text className="text-white text-xl font-bold mb-4">Today</Text>
      
      {/* Empty State */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-muted text-lg mb-4 text-center">No tasks scheduled for today.</Text>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-full">
          <Text className="text-white font-bold">+ Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
