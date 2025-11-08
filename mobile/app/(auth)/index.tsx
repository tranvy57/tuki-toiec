import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { colors } from '~/constants/Color';
import LottieView from 'lottie-react-native';
import { LoadingComponent } from '~/constants/Animation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '~/api/auth/useAuth';
import { LoginReqSchema, LoginReqType } from '~/types/request/loginReq';



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: login, error } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginReqType>({
    resolver: zodResolver(LoginReqSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginReqType) => {
    // setIsLoading(true);
    // console.log('Logging in with:', data);
    setIsLoading(true);
    await login(data);
    if(!error) {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    } else {
      setIsLoading(false);
    }
    // setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 bg-brand-coral-300">
          {/* background circles */}
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
              <Text className="mb-2 text-3xl font-bold text-white">Tuki TOEIC</Text>
              <Text className="text-lg text-white/80">Learner</Text>
            </View>

            {/* Login Form */}
            <View className="space-y-6">
              {/* Email Input */}
              <View className="mb-6">
                <View
                  className={`rounded-2xl bg-white/90 shadow-lg ${
                    errors.username ? 'border border-red-500' : ''
                  }`}>
                  <View className="flex-row items-center px-6 py-2">
                    <Entypo name="mail" size={20} color={colors.brandCoral} />
                    <Controller
                      control={control}
                      name="username"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className="ml-3 flex-1 text-lg text-gray-700"
                          placeholder="Username"
                          placeholderTextColor={errors.username ? '#EF4444' : '#999'}
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </View>
                </View>
                {errors.username && (
                  <Text className="ml-2 mt-1 text-xs text-red-500">{errors.username.message}</Text>
                )}
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <View
                  className={`rounded-2xl bg-white/90 shadow-lg ${
                    errors.password ? 'border border-red-500' : ''
                  }`}>
                  <View className="flex-row items-center px-6 py-2">
                    <Entypo name="lock" size={20} color={colors.brandCoral} />
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className="ml-3 flex-1 text-lg text-gray-700"
                          placeholder="Mật khẩu"
                          placeholderTextColor={errors.password ? '#EF4444' : '#999'}
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                        />
                      )}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={errors.password ? '#EF4444' : '#999'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.password && (
                  <Text className="ml-2 mt-1 text-xs text-red-500">{errors.password.message}</Text>
                )}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
                className={`shadow-brand h-[48px] overflow-hidden rounded-2xl  ${
                  isLoading ? 'bg-brand-coral-light opacity-70' : 'bg-brand-coral-dark'
                }`}>
                <View className="flex-1 flex-row items-center justify-center">
                  {isLoading ? (
                    <LottieView
                      autoPlay
                      style={{ width: 70, height: 70 }}
                      source={LoadingComponent}
                    />
                  ) : (
                    <Text className="text-lg font-semibold text-white">Đăng nhập</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

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
      </KeyboardAvoidingView>
    </>
  );
}
