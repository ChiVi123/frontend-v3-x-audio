import { Heart } from 'lucide-react';
import Image from 'next/image';
import { MainFooter } from '~/components/layouts/main-footer';
import { MainHeader } from '~/components/layouts/main-header';
import { Badge } from '~/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import { Input } from '~/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { Separator } from '~/components/ui/separator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
      <MainHeader />

      <main className="flex-1">
        {/* Breadcrumb Section */}
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList className="font-mono text-[10px] uppercase tracking-widest">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/collection">Collection</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Premium Headphones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070"
              alt="Premium Headphones"
              fill
              className="object-cover brightness-[0.7] dark:brightness-[0.4]"
              priority
            />
          </div>

          <div className="container relative z-10 mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <Badge
                variant="outline"
                className="w-fit border-white/20 text-white font-mono uppercase tracking-[0.2em] px-4 py-1"
              >
                New Arrival / 2026
              </Badge>
              <h1 className="text-5xl md:text-7xl font-heading leading-tight text-white tracking-tighter">
                Sonos <br /> <span className="italic">X-Series</span>
              </h1>
              <p className="max-w-[450px] text-lg text-zinc-300 font-sans leading-relaxed">
                Experience the pinnacle of acoustic engineering. High-fidelity sound meets precision design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="rounded-none px-10 h-14 uppercase tracking-widest font-bold">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-zinc-200 dark:bg-zinc-800" />

        {/* Technical Specs Section (The "Mono" Section) */}
        <section className="py-24 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">Technical Heritage</p>
                <h2 className="text-4xl font-heading italic tracking-tighter">Precision Engineering</h2>
              </div>
              <p className="max-w-md text-zinc-500 font-sans">
                Every component is meticulously crafted to deliver the most authentic audio experience possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200 dark:border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
              {[
                { label: 'Frequency Response', value: '5Hz — 40,000Hz', detail: 'Studio Grade Range' },
                { label: 'Driver Size', value: '50mm Titanium', detail: 'High-Efficiency Neodymium' },
                { label: 'Battery Life', value: '48 Hours', detail: 'With Active Noise Cancelling' },
              ].map((spec, i) => (
                <div key={i} className="p-10 space-y-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">Spec {i + 1}</span>
                  <h3 className="font-mono text-2xl font-medium tracking-tight group-hover:translate-x-1 transition-transform">
                    {spec.value}
                  </h3>
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-bold uppercase tracking-tighter">{spec.label}</span>
                    <span className="font-sans text-xs text-zinc-500">{spec.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Carousel / Lifestyle Section */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-heading italic tracking-tighter">Lifestyle Gallery</h2>
              <div className="flex gap-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Swipe to explore</p>
              </div>
            </div>
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  'https://images.unsplash.com/photo-1546435770-a3e426544a79?q=80&w=2070',
                  'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070',
                  'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070',
                  'https://images.unsplash.com/photo-1496950866446-3253e147052e?q=80&w=2070',
                ].map((src, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="relative aspect-square overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                        <Image src={src} alt={`Gallery Image ${index + 1}`} fill className="object-cover" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-[-50px]" />
                <CarouselNext className="right-[-50px]" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Product Cards Section */}
        <section className="py-24 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-heading tracking-tighter">The Collection</h2>
              <Separator className="w-20 mx-auto bg-black dark:bg-white h-0.5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: 'Studio Black X',
                  price: '$499.00',
                  badge: 'Limited',
                  src: 'https://images.unsplash.com/photo-1546435770-a3e426544a79?q=80&w=2070',
                },
                {
                  title: 'V3 Classic Silver',
                  price: '$349.00',
                  badge: 'Best Seller',
                  src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070',
                },
                {
                  title: 'Titanium Pulse',
                  price: '$599.00',
                  badge: 'Exclusive',
                  src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070',
                },
              ].map((item, i) => (
                <Card key={i} className="border-none bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden group">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <Badge className="absolute top-4 right-4 font-mono text-[10px] tracking-widest uppercase">
                      {item.badge}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-heading italic text-2xl">{item.title}</CardTitle>
                      <CardAction>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </CardAction>
                    </div>
                    <CardDescription className="font-sans">Premium audio for premium listeners.</CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      Noise Cancelling • High Res • Bluetooth 5.3
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <span className="font-mono text-xl font-bold tracking-tighter">{item.price}</span>
                    <Button
                      variant="ghost"
                      className="font-mono text-xs uppercase tracking-widest font-bold underline underline-offset-4"
                    >
                      Add to Bag
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination Component */}
            <Pagination>
              <PaginationContent className="font-mono text-xs uppercase tracking-tighter">
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>

        {/* Newsletter Section with Input */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="container mx-auto px-6 max-w-xl text-center space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500">The Inner Circle</p>
              <h2 className="text-4xl font-heading italic tracking-tighter">Join the V3-X List</h2>
            </div>
            <p className="text-zinc-400 font-sans text-sm">
              Be the first to know about exclusive drops, technical breakthroughs, and private events.
            </p>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="bg-transparent border-zinc-700 focus:border-white h-12 rounded-none font-mono text-xs tracking-widest uppercase"
              />
              <Button className="h-12 rounded-none px-8 font-mono text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-zinc-200">
                Subscribe
              </Button>
            </div>
          </div>
        </section>

        {/* Footer Text / Branding */}
        <section className="py-32 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <h2 className="text-[12vw] font-heading font-black tracking-tighter uppercase opacity-5 select-none leading-none">
            V3-X AUDIO
          </h2>
          <p className="font-mono text-xs tracking-[0.5em] uppercase text-zinc-400 mt-[-2vw]">Define your soundscape</p>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
