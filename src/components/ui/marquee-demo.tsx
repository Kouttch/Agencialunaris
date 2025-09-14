import { Marquee } from "@/components/ui/marquee"

const ClientLogos = {
  logo1: () => (
    <img 
      src="/lovable-uploads/logo-client-1.png" 
      alt="Cliente 1" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  logo2: () => (
    <img 
      src="/lovable-uploads/logo-client-2.png" 
      alt="Cliente 2" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  logo3: () => (
    <img 
      src="/lovable-uploads/logo-client-3.png" 
      alt="Cliente 3" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  greenit: () => (
    <img 
      src="/lovable-uploads/logo-greenit.png" 
      alt="Green IT" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  jotam: () => (
    <img 
      src="/lovable-uploads/logo-jotam.png" 
      alt="Jotam" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  superTenis: () => (
    <img 
      src="/lovable-uploads/logo-super-tenis.png" 
      alt="Super Tênis" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  reiDoFrango: () => (
    <img 
      src="/lovable-uploads/logo-rei-frango.png" 
      alt="Rei do Frango" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  logo6: () => (
    <img 
      src="/lovable-uploads/logo-client-6.png" 
      alt="Cliente 6" 
      className="h-[50px] w-auto object-contain filter brightness-90"
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