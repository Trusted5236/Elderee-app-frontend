import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const animation = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => setModalVisible(false));
  }

  const validateAndSubmit = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setTimeout(() => {
        setError('');
      }, 2000);
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
    <View className="flex h-full items-center px-6 pt-32 bg-white">
      <View className="flex items-center w-full">
        <Text className="text-3xl font-bold text-[#004FD6] mb-2">Reset Your Password</Text>
        <Text className="text-lg text-center text-gray-400 mb-10">Let&apos;s get you back into Elderee</Text>

        {/* Password Input */}
        <View className="w-full flex flex-col gap-2 mb-5">
          <Text className="text-gray-500">Password</Text>
          <View className="relative">
            <TextInput
              className="border rounded px-4 py-3 w-full text-gray-500 pr-10"
              placeholder="Enter your new password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!togglePassword}
              autoCapitalize="none"
              selectionColor="#000"
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setTogglePassword(!togglePassword)}
            >
              <MaterialCommunityIcons
                name={togglePassword ? 'eye-off' : 'eye'}
                color="#2563EB"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View className="w-full flex flex-col gap-2 mb-5">
          <Text className="text-gray-500">Re-Enter Password</Text>
          <View className="relative">
            <TextInput
              className="border rounded px-4 py-3 w-full text-gray-500 pr-10"
              placeholder="Re-enter your new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!toggleConfirmPassword}
              autoCapitalize="none"
              selectionColor="#000"
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setToggleConfirmPassword(!toggleConfirmPassword)}
            >
              <MaterialCommunityIcons
                name={toggleConfirmPassword ? 'eye-off' : 'eye'}
                color="#2563EB"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error !== '' && (
          <Text className="text-red-500 text-sm mb-3 w-full text-start">{error}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-[#004FD6] py-3 rounded w-full"
          onPress={validateAndSubmit}
        >
          <Text className="text-white text-center font-bold text-lg">Reset Password</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Success Modal */}
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
          <Pressable
            onPress={(e) => e.stopPropagation()}
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
                  <MaterialCommunityIcons name="check-outline" color="#2563EB" size={32} />
                </View>
              </View>
              <Text className="text-center text-xl font-bold text-gray-800 mb-2">
                Password Reset Successful
              </Text>
              <Text className="text-center text-gray-600 mb-6">
                Your password has been successfully changed. You can now login with your new password.
              </Text>
              <TouchableOpacity
                className="bg-[#004FD6] py-3 rounded"
                onPress={() => {
                  closeModal();
                  router.push('/');
                }}
              >
                <Text className="text-white text-center font-bold text-lg">Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}