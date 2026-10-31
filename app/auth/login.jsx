import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { supabase } from '../../lib/supabase';
import { useRouter, Link } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        try {
            console.log("Attempting to sign in...", email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log("Sign in result:", { data, error });
            
            if (error) {
                Alert.alert("Sign In Error", error.message);
                if (typeof window !== 'undefined' && window.alert) window.alert(error.message);
            } else {
                console.log("Sign in successful!");
                // Layout automatically handles redirect due to session change
            }
        } catch (e) {
            console.error("Exception during sign in:", e);
            Alert.alert("Error", e.message || "An unexpected error occurred");
            if (typeof window !== 'undefined' && window.alert) window.alert(e.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Text className="text-4xl font-bold text-text mb-2 text-white">
                Welcome Back
            </Text>
            <Text className="text-text-secondary text-lg mb-8 text-gray-400">Sign in to continue your journey.</Text>

            <View className="w-full mb-4">
                <TextInput
                    className="w-full bg-surface text-text px-4 py-4 rounded-xl mb-4 border border-panel text-white"
                    placeholder="Email"
                    placeholderTextColor="#657087"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    className="w-full bg-surface text-text px-4 py-4 rounded-xl mb-6 border border-panel text-white"
                    placeholder="Password"
                    placeholderTextColor="#657087"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                
                <TouchableOpacity 
                    className="bg-primary w-full py-4 rounded-xl items-center mb-6"
                    onPress={signInWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Sign In</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-2">
                    <Text className="text-text-secondary text-gray-400">Don't have an account? </Text>
                    <Link href="/auth/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-primary font-bold text-[#7C6CFF]">Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}