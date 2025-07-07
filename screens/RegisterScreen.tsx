import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import { useNavigation } from '@react-navigation/native'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) Alert.alert('Signup error', error.message)
    else {
      Alert.alert('Success', 'Check your email to confirm your account.')
      navigation.navigate('Login')
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  )
}
