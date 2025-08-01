import React from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import * as Linking from 'expo-linking'

export default function InvoiceCard({ invoice }: { invoice: any }) {
  const handleViewPdf = () => {
    if (invoice.pdf_url) {
      Linking.openURL(invoice.pdf_url)
    } else {
      Alert.alert('No PDF available')
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{invoice.client_name}</Text>
      <Text>Status: {invoice.status}</Text>
      <Text>Amount: R{invoice.amount}</Text>
      {invoice.pdf_url && (
        <View style={{ marginTop: 10 }}>
          <Button title="View PDF" onPress={handleViewPdf} />
        </View>
      )}
    </View>
  )
}

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
})
