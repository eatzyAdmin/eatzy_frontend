import MessagesLayout from '@/features/messages/components/MessagesLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages - Eatzy',
  description: 'Your messages and notifications',
};

export default function MessagesPage() {
  return <MessagesLayout />;
}
