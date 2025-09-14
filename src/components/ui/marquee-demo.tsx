import { Marquee } from "@/components/ui/marquee"

const ClientLogos = {
  logo1: () => (
    <img 
      src="/client-logos/logo-1.png" 
      alt="Cliente 1" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  logo2: () => (
    <img 
      src="/client-logos/logo-2.png" 
      alt="Cliente 2" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  logo3: () => (
    <img 
      src="/client-logos/logo-3.png" 
      alt="Cliente 3" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  greenit: () => (
    <img 
      src="/client-logos/greenit.png" 
      alt="Green IT" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  jotam: () => (
    <img 
      src="/client-logos/jotam.png" 
      alt="Jotam" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  superTenis: () => (
    <img 
      src="/client-logos/super-tenis.png" 
      alt="Super Tênis" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  reiDoFrango: () => (
    <img 
      src="/client-logos/rei-do-frango.png" 
      alt="Rei do Frango" 
      className="h-[40px] w-auto object-contain"
    />
  ),
  logo6: () => (
    <img 
      src="/client-logos/logo-6.png" 
      alt="Cliente 6" 
      className="h-[40px] w-auto object-contain"
    />
  ),
};


export function MarqueeDemo() {
  const arr = [
    ClientLogos.logo1, 
    ClientLogos.logo2, 
    ClientLogos.logo3, 
    ClientLogos.greenit, 
    ClientLogos.jotam, 
    ClientLogos.superTenis, 
    ClientLogos.reiDoFrango, 
    ClientLogos.logo6
  ]

  return (
    <Marquee>
      {arr.map((Logo, index) => (
        <div
          key={index}
          className="relative h-full w-fit mx-[4rem] flex items-center justify-center"
        >
          <Logo />
        </div>
      ))}
    </Marquee>
  )
}