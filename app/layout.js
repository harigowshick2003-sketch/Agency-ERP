import './globals.css'

export const metadata = {
  title: 'Agency ERP — Operations Platform',
  description: 'Social Media Marketing Operations Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
