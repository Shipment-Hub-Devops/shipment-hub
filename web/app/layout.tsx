import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ShipmentHub — Logistics coordination & tracking',
  description:
    'A lightweight logistics coordination platform for African freight: request shipments, coordinate operations, and track deliveries from pickup to drop-off.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}