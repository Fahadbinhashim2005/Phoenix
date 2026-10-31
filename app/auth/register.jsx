import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from '../../lib/supabase';
import { useRouter, Link } from 'expo-router';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signUpWithEmail() {
        setLoading(true);
        try {
            console.log("Attempting to sign up...", email);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            console.log("Sign up result:", { data, error });

            if (error) {
                Alert.alert("Sign Up Error", error.message);
                if (typeof window !== 'undefined' && window.alert) window.alert(error.message);
            } else if (!data.session) {
                Alert.alert("Success", "Please check your inbox for email verification!");
                if (typeof window !== 'undefined' && window.alert) window.alert("Please check your inbox for email verification!");
                router.replace('/auth/login');
            } else {
                console.log("Sign up successful!");
                // Auth context will redirect to /(tabs)/home automatically
            }
        } catch (e) {
            console.error("Exception during sign up:", e);
            Alert.alert("Error", e.message || "An unexpected error occurred");
            if (typeof window !== 'undefined' && window.alert) window.alert(e.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Text className="text-3xl font-bold text-primary mb-2">
                Join Phoenix
            </Text>
            <Text className="text-text-secondary text-lg mb-8">Rise. Rebuild. Become.</Text>

            <View className="w-full mb-4">
                <TextInput
                    className="w-full bg-surface text-text px-4 py-3 rounded-lg mb-4 border border-panel"
                    placeholder="Email"
                    placeholderTextColor="#657087"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    className="w-full bg-surface text-text px-4 py-3 rounded-lg mb-6 border border-panel"
                    placeholder="Password"
                    placeholderTextColor="#657087"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                
                <TouchableOpacity 
                    className="bg-primary w-full py-3 rounded-lg items-center mb-6"
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    <Text className="text-white font-semibold text-lg">{loading ? 'Loading...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-2">
                    <Text className="text-text-secondary">Already have an account? </Text>
                    <Link href="/auth/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-primary font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
