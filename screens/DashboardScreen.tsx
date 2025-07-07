import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Button, Alert } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import InvoiceCard from '../components/InvoiceCard'
import { useNavigation } from '@react-navigation/native'

export default function DashboardScreen() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  const fetchInvoices = async () => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.id) return

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })

    if (error) Alert.alert('Error loading invoices', error.message)
    else setInvoices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  const handleNewInvoice = () => {
    if (invoices.length >= 10) {
      Alert.alert('Limit reached', 'You can only create 10 invoices on the free plan.')
    } else {
      navigation.navigate('CreateInvoice')
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontSize: 24 }}>Your Invoices</Text>
        <Button title="Log out" onPress={handleLogout} />
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={invoices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <InvoiceCard invoice={item} />}
          />
          <Button title="Create Invoice" onPress={handleNewInvoice} />
        </>
      )}
    </View>
