export function generateConfirmEmailHTML(name: string, confirmationUrl: string): string {
  return `...`.replace('{{first_name}}', name).replace('{{confirmation_url}}', confirmationUrl)
}
