import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function InvoiceCard({ invoice }: { invoice: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{invoice.client_name}</Text>
      <Text>Status: {invoice.status}</Text>
      <Text>Amount: R{invoice.amount}</Text>
      <Text style={styles.date}>
        {new Date(invoice.created_at).toLocaleDateString()}
      </Text>
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
  date: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
})
