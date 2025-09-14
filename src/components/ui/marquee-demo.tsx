import { Marquee } from "@/components/ui/marquee"

const ClientLogos = {
  cliente1: () => (
    <img 
      src="/lovable-uploads/logo-cliente-7.png" 
      alt="Cliente 1" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  greenit: () => (
    <img 
      src="/lovable-uploads/logo-greenit-novo.png" 
      alt="Green IT" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  jotam: () => (
    <img 
      src="/lovable-uploads/logo-jotam-novo.png" 
      alt="Jotam" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  superTenis: () => (
    <img 
      src="/lovable-uploads/logo-super-tenis-novo.png" 
      alt="Super Tênis" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
  reiDoFrango: () => (
    <img 
      src="/lovable-uploads/logo-rei-frango-novo.png" 
      alt="Rei do Frango" 
      className="h-[50px] w-auto object-contain filter brightness-90"
    />
  ),
};


export function MarqueeDemo() {
  const arr = [
    ClientLogos.cliente1, 
    ClientLogos.greenit, 
    ClientLogos.jotam, 
    ClientLogos.superTenis, 
    ClientLogos.reiDoFrango
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