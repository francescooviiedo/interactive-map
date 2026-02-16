import Context from './components/Context';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params;
  const eventId = Number(id);

  if (Number.isNaN(eventId)) {
    notFound();
  }

  return <Context eventId={eventId} />;
}
