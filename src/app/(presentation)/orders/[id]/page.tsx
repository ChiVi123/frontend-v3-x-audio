export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId = 'VX-88921' } = await params;

  return <h1 className="text-3xl font-heading">Order Details {orderId} Page</h1>;
}
