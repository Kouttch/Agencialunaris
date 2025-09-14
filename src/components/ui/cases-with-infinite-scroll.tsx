"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ClientLogos = {
  cliente1: () => (
    <img 
      src="/lovable-uploads/cliente-7.png" 
      alt="Cliente 1" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  greenit: () => (
    <img 
      src="/lovable-uploads/logo-greenit-novo.png" 
      alt="Green IT" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  jotam: () => (
    <img 
      src="/lovable-uploads/logo-jotam-novo.png" 
      alt="Jotam" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  superTenis: () => (
    <img 
      src="/lovable-uploads/logo-super-tenis-novo.png" 
      alt="Super Tênis" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  reiDoFrango: () => (
    <img 
      src="/lovable-uploads/logo-rei-frango-novo.png" 
      alt="Rei do Frango" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  clienteNovo: () => (
    <img 
      src="/lovable-uploads/logo-cliente-novo.png" 
      alt="Cliente" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  cliente8: () => (
    <img 
      src="/lovable-uploads/logo-cliente-8.png" 
      alt="Cliente 8" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  cliente9: () => (
    <img 
      src="/lovable-uploads/logo-cliente-9.png" 
      alt="Cliente 9" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
  cliente10: () => (
    <img 
      src="/lovable-uploads/logo-cliente-10.png" 
      alt="Cliente 10" 
      className="h-[80px] w-auto object-contain filter brightness-90"
    />
  ),
};

function Case() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const logos = [
    ClientLogos.cliente1, 
    ClientLogos.greenit, 
    ClientLogos.jotam, 
    ClientLogos.superTenis, 
    ClientLogos.reiDoFrango,
    ClientLogos.clienteNovo,
    ClientLogos.cliente8,
    ClientLogos.cliente9,
    ClientLogos.cliente10
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [api, current]);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
            Alguns de nossos Clientes
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {logos.map((Logo, index) => (
                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6" key={index}>
                  <div className="flex rounded-md aspect-square bg-muted/50 items-center justify-center p-6 hover:bg-muted/80 transition-colors">
                    <Logo />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export { Case };