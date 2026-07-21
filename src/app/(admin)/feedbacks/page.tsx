import { Metadata } from 'next';

import { FeedbacksPageClient } from '@/components/feedbacks/FeedbacksPageClient';

export const metadata: Metadata = {
  title: 'Відгуки | Della Rosee Admin',
};

export default function FeedbacksPage() {
  return <FeedbacksPageClient />;
}
