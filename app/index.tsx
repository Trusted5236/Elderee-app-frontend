import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-600 mb-6">Welcome to Elderee App</Text>

      <TouchableOpacity
        className="bg-blue-600 py-3 px-6 rounded mb-5"
        onPress={() => router.push('/auth/forgot-password')}
      >
        <Text className="text-white font-medium">Forgot Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-blue-600 py-3 px-6 rounded"
        onPress={() => router.push('/auth/otp-verification')}
      >
        <Text className="text-white font-medium">OTP verification</Text>
      </TouchableOpacity>
    </View>
  );
}