import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import { useNavigation } from '@react-navigation/native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert('Login error', error.message)
    else navigation.navigate('Dashboard')
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Log In</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 10 }} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  )
}
