import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => setModalVisible(false));
  }

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    setError('');
    setModalVisible(true);

    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 100,
      damping: 15,
      mass: 1,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex h-full items-center px-6 pt-32 bg-white">
        <View className="flex items-center w-full">
          <Text className="text-3xl font-bold text-[#004FD6] mb-2">Forgot Your Password?</Text>
          <Text className="text-lg text-center text-gray-400 mb-10">
            Enter your email and we&apos;ll send you a verification code
          </Text>

          <View className="w-full flex flex-col gap-2 mb-5">
            <Text className="text-gray-500">Email</Text>
            <TextInput
              className={`border rounded px-4 py-3 w-full text-gray-500 ${
                isFocused ? 'border-black' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              selectionColor='#000'
            />
            {error !== '' && (
              <Text className="text-red-500 text-sm mb-3">{error}</Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-[#004FD6] py-3 rounded w-full"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              className="flex-1 justify-end bg-black/20"
              onPress={closeModal}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0], // slide up
                      }),
                    },
                  ],
                  opacity: animation,
                }}
                className="bg-white p-6 rounded-t-2xl"
              >
                <View className="items-center mb-4">
                  <View className="bg-blue-100 rounded-full p-4 mb-4">
                    <MaterialCommunityIcons name="email-outline" color="#2563EB" size={32} />
                  </View>
                </View>
                <Text className="text-center text-xl font-bold text-gray-800 mb-2">
                  Reset Link Sent
                </Text>
                <Text className="text-center text-gray-600 mb-6">
                  A password reset link has been sent to your email. Use the link to reset your password.
                </Text>
                <TouchableOpacity
                  className="bg-[#004FD6] py-3 rounded"
                  onPress={() => {
                    closeModal();
                    router.push('/auth/reset-password');
                  }}
                >
                  <Text className="text-white text-center font-bold text-lg">Open Email</Text>
                </TouchableOpacity>
              </Animated.View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}