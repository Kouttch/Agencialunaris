import React, { type SVGProps } from "react";

// Logomarcas dos clientes usando as imagens fornecidas
function ReiDoFrangoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/58085403-9641-4c95-b5c8-70adf41b1a68.png"
        alt="Rei do Frango"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

function GeometricBlueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/9066b8af-4e34-4366-833f-522cf7d74814.png"
        alt="Logo Geométrico"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

function GreenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/93ee5ae4-973c-4241-a4a9-74c040eedf8a.png"
        alt=".Green"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

function SuperTenisIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/e25da953-9cc8-49a5-a664-0382f554ec02.png"
        alt="Super Tênis"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

function MascotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/9da1a037-475d-4325-84fe-8e112c174298.png"
        alt="Mascote"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

// Criando SVGs melhorados para completar as 8 logomarcas
function TechBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 60"
      width="120"
      height="60"
      className="fill-muted-foreground"
      {...props}
    >
      <rect x="20" y="20" width="80" height="20" rx="10" fill="hsl(var(--primary))" />
      <circle cx="30" cy="30" r="6" fill="hsl(var(--background))" />
      <circle cx="50" cy="30" r="6" fill="hsl(var(--background))" />
      <circle cx="70" cy="30" r="6" fill="hsl(var(--background))" />
      <circle cx="90" cy="30" r="6" fill="hsl(var(--background))" />
    </svg>
  );
}

function ModernBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 60"
      width="100"
      height="60"
      className="fill-muted-foreground"
      {...props}
    >
      <rect x="10" y="15" width="80" height="30" rx="15" fill="hsl(var(--accent))" />
      <circle cx="30" cy="30" r="8" fill="hsl(var(--background))" />
      <circle cx="70" cy="30" r="8" fill="hsl(var(--background))" />
      <rect x="40" y="22" width="20" height="16" rx="8" fill="hsl(var(--primary))" />
    </svg>
  );
}

function DigitalBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 60"
      width="120"
      height="60"
      className="fill-muted-foreground"
      {...props}
    >
      <polygon 
        points="30,15 60,15 90,30 60,45 30,45" 
        fill="hsl(var(--primary))" 
      />
      <circle cx="45" cy="30" r="8" fill="hsl(var(--background))" />
      <circle cx="75" cy="30" r="4" fill="hsl(var(--accent))" />
    </svg>
  );
}

export const clientLogos = [
  { name: "Rei do Frango", id: 1, img: ReiDoFrangoIcon },
  { name: "Geométrico", id: 2, img: GeometricBlueIcon },
  { name: "Green", id: 3, img: GreenIcon },
  { name: "Super Tênis", id: 4, img: SuperTenisIcon },
  { name: "Mascote", id: 5, img: MascotIcon },
  { name: "Tech Brand", id: 6, img: TechBrandIcon },
  { name: "Modern Brand", id: 7, img: ModernBrandIcon },
  { name: "Digital Brand", id: 8, img: DigitalBrandIcon },
];