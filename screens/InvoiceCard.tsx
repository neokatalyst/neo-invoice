import React from 'react'
import { View, Text, StyleSheet, Button, Alert } from 'react-native'
import { generateInvoicePDF } from '../lib/generateInvoicePDF'
import { uploadToSupabaseStorage } from '../lib/uploadToStorage'
import { supabase } from '../lib/supabaseClient'
import * as Linking from 'expo-linking'
 import * as MailComposer from 'expo-mail-composer'

export default function InvoiceCard({ invoice }: { invoice: any }) {
  const handleExport = async () => {
    try {
      const fileUri = await generateInvoicePDF(invoice)

      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user?.id) throw new Error('User not authenticated')

      const pdfUrl = await uploadToSupabaseStorage(fileUri, userData.user.id)

      // Save PDF URL back to invoices table
      const { error } = await supabase
        .from('invoices')
        .update({ pdf_url: pdfUrl })
        .eq('id', invoice.id)

      if (error) throw error

      Alert.alert('Invoice PDF saved!', `PDF URL saved: ${pdfUrl}`)
    } catch (e: any) {
      Alert.alert('Error', e.message)
    }
  }

 

const handleEmailInvoice = async () => {
  if (!invoice.pdf_url) return Alert.alert('No PDF available')

  await MailComposer.composeAsync({
    recipients: [invoice.client_email],
    subject: 'Your Invoice from Neo-Invoice',
    body: `Hi ${invoice.client_name},\n\nPlease find your invoice here: ${invoice.pdf_url}`,
  })
}


  return (
    <View style={styles.card}>
      <Text style={styles.title}>{invoice.client_name}</Text>
      <Text>Status: {invoice.status}</Text>
      <Text>Amount: R{invoice.amount}</Text>
      <Text style={styles.date}>
        {new Date(invoice.created_at).toLocaleDateString()}
      </Text>
      <View style={{ marginTop: 10 }}>
        <Button title="Generate PDF" onPress={handleExport} />
      </View>
    </View>
  )
}



{invoice.pdf_url && (
  <View style={{ marginTop: 10 }}>
    <Button title="View PDF" onPress={() => Linking.openURL(invoice.pdf_url)} />
  </View>
)}

{invoice.pdf_url && (
  <View style={{ marginTop: 10 }}>
    <Button title="Email Invoice" onPress={handleEmailInvoice} />
  </View>
)}




const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
})
