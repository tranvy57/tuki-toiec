import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { colors } from '~/constants/Color';
import LottieView from 'lottie-react-native';
import { LoadingComponent } from '~/constants/Animation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Handle actual login logic here
    }, 2000);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 bg-primary">
          <View className="absolute inset-0">
            <View className="absolute left-10 top-20 h-32 w-32 rounded-full bg-white/10" />
            <View className="absolute right-20 top-40 h-20 w-20 rounded-full bg-white/20" />
            <View className="absolute bottom-40 left-5 h-40 w-40 rounded-full bg-white/5" />
          </View>

          <View className="flex-1 justify-center px-8">
            {/* Logo Section */}
            <View className="mb-12 items-center">
              <View className="shadow-brand mb-6 h-24 w-24 items-center justify-center rounded-full bg-white">
                <Ionicons name="book" size={40} color={colors.brandCoral} />
              </View>
              <Text className="mb-2 text-3xl font-bold text-white">Smart TOEIC</Text>
              <Text className="text-lg text-white/80">Learner</Text>
            </View>

            {/* Login Form */}
            <View className="space-y-6">
              {/* Email Input */}
              <View className="mb-6 rounded-2xl bg-white/90 shadow-lg">
                <View className="flex-row items-center px-6 py-2">
                  <Entypo name="mail" size={20} color={colors.brandCoral} />
                  <TextInput
                    className="ml-3 flex-1 text-lg text-gray-700"
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6 rounded-2xl bg-white/90 shadow-lg">
                <View className="flex-row items-center px-6 py-2">
                  <Entypo name="lock" size={20} color={colors.brandCoral} />
                  <TextInput
                    className="ml-3 flex-1 text-lg text-gray-700"
                    placeholder="Mật khẩu"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className={`shadow-brand h-[48px] overflow-hidden rounded-2xl  ${isLoading ? 'py-0 bg-brand-coral-light opacity-70' : 'py-4 bg-brand-coral-dark'}`}>
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <View className="items-center justify-center">
                      <LottieView
                        autoPlay
                        style={{
                          width: 70,
                          height: 70,
                          padding: 0,
                          opacity: 1
                        }}
                        source={LoadingComponent}
                      />
                    </View>
                  ) : (
                    <Text className="text-lg font-semibold text-white">Đăng nhập</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Forgot Password */}
              <View className="mt-6 items-center">
                <TouchableOpacity>
                  <Text className="text-base text-white/80">Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* Register Link */}
              <View className="mt-8 flex-row items-center justify-center">
                <Text className="text-base text-white/80">Chưa có tài khoản? </Text>
                <TouchableOpacity>
                  <Text className="text-base font-semibold text-white underline">Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
