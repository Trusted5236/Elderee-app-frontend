import { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OTPVerificationScreen() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const router = useRouter();

    const handleChange = (text: string, index: number) => {
        if (/^\d$/.test(text) || text === '') {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text !== '' && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }

            if (text === '' && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = () => {
        const otpCode = otp.join('');
        if (otpCode.length === 4) {
            // Simulate success
            console.log('OTP Verified:', otpCode);
            router.push('/auth/reset-password'); // navigate to reset password
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex h-full items-center px-6 pt-32 bg-white">
                <Text className="text-3xl font-bold text-[#004FD6] mb-2">Check Your Sms</Text>
                <Text className="text-lg text-center text-gray-400 mb-10">
                    Kindly enter the verification code sent to the phone number provided.
                </Text>

                {/* OTP Inputs */}
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 32,
                        width: '100%',
                        maxWidth: 300,
                    }}
                >
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref; }}
                            style={{
                                borderWidth: 1.5,
                                borderColor: '#EBF8FF',
                                width: 56,
                                height: 56,
                                borderRadius: 8,
                                textAlign: 'center',
                                fontSize: 24,
                                color: '#004FD6',
                            }}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            selectionColor="#004FD6"
                        />
                    ))}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    className={`py-3 rounded w-full max-w-xs bg-[#004FD6] mb-5`}
                    disabled={!otp.every((digit) => digit !== '')}
                    onPress={handleSubmit}
                >
                    <Text className="text-white text-center font-bold text-lg">Verify Email</Text>
                </TouchableOpacity>

                {/* Bottom Options */}
                <View className="mt-6 items-center space-y-2">
                    <Text className="text-gray-400 mb-5">
                        Didn’t receive the Sms?{' '}
                        <Text className="text-blue-600 font-semibold">Click to resend</Text>
                    </Text>
                    <TouchableOpacity 
                        onPress={() => router.push('/')} 
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 5
                        }}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={20} />
                        <Text className="text-gray-500">Back to log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}