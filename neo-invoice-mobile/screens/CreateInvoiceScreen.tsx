import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { supabase } from '@/lib/supabaseClient'

export default function CreateInvoiceScreen() {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [invoiceCount, setInvoiceCount] = useState(0)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchUserAndLimit = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const id = userData.user?.id
      if (!id) return
      setUserId(id)

      const { count, error } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id)

      if (error) {
        Alert.alert('Error fetching limit', error.message)
      } else {
        setInvoiceCount(count || 0)
      }
    }

    fetchUserAndLimit()
  }, [])

  const handleSubmit = async () => {
    if (!clientName || !clientEmail || !amount) {
      return Alert.alert('All fields are required')
    }

    if (invoiceCount >= 10) {
      return Alert.alert('Limit reached', 'Upgrade to continue creating invoices.')
    }

    const { error } = await supabase.from('invoices').insert({
      user_id: userId,
      client_name: clientName,
      client_email: clientEmail,
      amount: parseFloat(amount),
      status: 'unpaid',
    })

    if (error) {
      Alert.alert('Error saving invoice', error.message)
    } else {
      Alert.alert('Success', 'Invoice created!')
      navigation.goBack()
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create Invoice</Text>
      <TextInput
        placeholder="Client Name"
        value={clientName}
        onChangeText={setClientName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Client Email"
        value={clientEmail}
        onChangeText={setClientEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
        keyboardType="numeric"
      />
      <Button title="Save Invoice" onPress={handleSubmit} />
    </View>
  )
}
