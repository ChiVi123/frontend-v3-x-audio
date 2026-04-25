import { CreditCard, MapPin } from 'lucide-react';
import Image from 'next/image';
import { OrderTrackingBar } from '~/components/features/orders/order-tracking-bar';
import { MainFooter } from '~/components/layouts/main-footer';
import { MainHeader } from '~/components/layouts/main-header';
import { Button } from '~/components/ui/button';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Use id from params or a default for mock
  const orderId = params.id === 'default' ? 'VX-88921' : params.id;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <MainHeader />

      <main className="flex-1 container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-heading tracking-tight mb-2">Order #{orderId}</h1>
          <p className="text-muted-foreground font-sans">Placed on October 24, 2024</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Tracking Status */}
            <section className="rounded-2xl border border-border bg-surface-container-high p-8">
              <span className="mb-6 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Tracking Status
              </span>
              <OrderTrackingBar currentStep="shipped" />
            </section>

            {/* Items */}
            <section>
              <h2 className="mb-6 text-3xl font-heading tracking-tight">Items</h2>
              <div className="rounded-2xl border border-border bg-surface-container-low divide-y divide-border">
                {[
                  {
                    id: 'i1',
                    name: 'Reference Over-Ear Headphones V3',
                    price: 1299,
                    qty: 1,
                    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200',
                    specs: ['32Ω', 'Black/Gold'],
                  },
                  {
                    id: 'i2',
                    name: 'Audiophile Grade Braided Cable',
                    price: 149,
                    qty: 1,
                    image: 'https://images.unsplash.com/photo-1546435770-a3e426544a79?q=80&w=200',
                    specs: ['2m', 'Copper'],
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-6 p-6">
                    <div className="relative size-20 rounded-lg overflow-hidden bg-background border border-border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-lg text-foreground leading-snug">{item.name}</h4>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {item.specs.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-foreground">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping & Payment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#292a2a] bg-[#1a1c1c] p-6">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <MapPin className="size-4" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest">
                    Shipping Address
                  </span>
                </div>
                <div className="text-sm text-on-surface-variant space-y-1">
                  <p className="font-semibold text-foreground">Alex Mercer</p>
                  <p>1012 Precision Way, Suite 400</p>
                  <p>Seattle, WA 98101</p>
                  <p>United States</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#292a2a] bg-[#1a1c1c] p-6">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <CreditCard className="size-4" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest">Payment Method</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground">
                    VISA
                  </div>
                  <span className="text-sm text-on-surface-variant">Ending in 4242</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Billing address matches shipping</p>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface-container-high p-8 shadow-2xl">
              <h3 className="mb-8 text-4xl font-heading tracking-tight">Summary</h3>
              <div className="space-y-4 font-sans text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">$1,448.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping (Express)</span>
                  <span className="text-foreground">$25.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax</span>
                  <span className="text-foreground">$147.30</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-heading">Total</span>
                  <span className="text-2xl font-mono font-bold text-primary">$1,620.30</span>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm h-12 font-bold uppercase tracking-widest text-[11px]">
                  Download Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-surface-container-high rounded-sm h-12 font-bold uppercase tracking-widest text-[11px]"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
