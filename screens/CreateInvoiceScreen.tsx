import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { supabase } from '../lib/supabaseClient'
import { useNavigation } from '@react-navigation/native'

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
      Alert.al
