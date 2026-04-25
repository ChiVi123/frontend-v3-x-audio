import { ArrowRight, AudioLines } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryHeroCard } from '~/components/features/home/category-hero-card';
import { ProductCard } from '~/components/features/products/product-card';
import { MainFooter } from '~/components/layouts/main-footer';
import { MainHeader } from '~/components/layouts/main-header';
import { Button } from '~/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <MainHeader />

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-heading leading-[1.1] tracking-tight">
                  Crafted for the <br />
                  <span className="text-primary italic">Golden Ear</span>
                </h1>
                <p className="max-w-[480px] text-lg text-muted-foreground leading-relaxed">
                  Experience the profound silence between the notes. Our precision-engineered audio components deliver
                  uncompromised clarity and uncompromising luxurious aesthetics for the true audiophile.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-10 h-14 font-bold uppercase tracking-widest text-xs"
                >
                  Explore Collection
                </Button>
              </div>
            </div>

            <div className="relative aspect-square w-full max-w-[600px] mx-auto animate-in fade-in zoom-in duration-1000 delay-200">
              <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent blur-3xl rounded-full" />
              <Image
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200"
                alt="V3-X Reference Headphones"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(242,202,80,0.15)]"
                priority
              />
            </div>
          </div>
        </section>

        {/* ── AI Sound Profile Quiz ── */}
        <section className="py-24">
          <div className="w-full border-y border-border bg-surface-container-low/40 backdrop-blur-sm transition-all duration-300">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between py-16 gap-10">
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5">
                  <AudioLines className="size-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-heading text-foreground tracking-tight">AI Sound Profile Quiz</h2>
                  <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                    Calibrate your listening experience based on your unique physiological hearing curve.
                  </p>
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-12 h-14 font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/10 shrink-0">
                Start Calibration
              </Button>
            </div>
          </div>
        </section>

        {/* ── Curated Acoustics ── */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 text-4xl md:text-5xl font-heading tracking-tight">Curated Acoustics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CategoryHeroCard
                title="Over-ear Reference"
                caption="Explore Series"
                href="/catalog?category=over-ear"
                imageSrc="https://images.unsplash.com/photo-1546435770-a3e426544a79?q=80&w=800"
              />
              <CategoryHeroCard
                title="Precision IEMs"
                caption="Intimate Detail"
                href="/catalog?category=iem"
                imageSrc="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800"
              />
              <CategoryHeroCard
                title="DACs & Amplification"
                caption="Pure Power"
                href="/catalog?category=amps"
                imageSrc="https://images.unsplash.com/photo-1616423641454-da541336440c?q=80&w=800"
              />
            </div>
          </div>
        </section>

        {/* ── Masterworks (Featured) ── */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 flex items-end justify-between border-b border-border pb-6">
              <h2 className="text-4xl md:text-5xl font-heading tracking-tight">Masterworks</h2>
              <Link
                href="/catalog"
                className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:text-foreground"
              >
                View All <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <ProductCard
                id="p1"
                name="V-Series Obsidian"
                tagline="Closed-Back Planar Magnetic"
                price={1299}
                imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
                href="/products/v-series-obsidian"
                specs={['32Ω', 'Hi-Res Audio']}
                badge="In Stock"
              />
              <ProductCard
                id="p2"
                name="Argentum Core Cable"
                tagline="Pure Silver Litz Upgrade"
                price={450}
                imageSrc="https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800"
                href="/products/argentum-core"
                specs={['4.4mm Balanced', '2-Pin']}
              />
              <ProductCard
                id="p3"
                name="DAP M-1 Titanium"
                tagline="Reference Portable Player"
                price={2100}
                imageSrc="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800"
                href="/products/dap-m1"
                specs={['Dual AK4499', 'Class A Amp']}
              />
            </div>
          </div>
        </section>

        {/* ── Branding Outro ── */}
        <section className="py-40 text-center">
          <h2 className="text-[12vw] font-heading font-black tracking-tighter uppercase text-surface-container select-none leading-none">
            V3-X AUDIO
          </h2>
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="font-mono text-xs tracking-[0.5em] uppercase text-outline-variant-brand">
              Precision Engineering for the Purist.
            </p>
            <p className="text-[10px] text-border uppercase tracking-widest">© 2026 V3-X Audio. All Rights Reserved.</p>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
