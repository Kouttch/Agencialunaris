import React, { type SVGProps } from "react";

// Novos logos dos clientes
function ReiDoFrangoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/58085403-9641-4c95-b5c8-70adf41b1a68.png"
        alt="Rei do Frango"
        className="h-full w-full object-contain"
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
        className="h-full w-full object-contain"
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
        className="h-full w-full object-contain"
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
        className="h-full w-full object-contain"
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
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function RedLineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      width="120"
      height="40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0" y="15" width="120" height="10" fill="#E53E3E" rx="5" />
    </svg>
  );
}

function SimpleBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 50"
      width="100"
      height="50"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="25" cy="25" r="15" fill="hsl(var(--primary))" />
      <rect x="45" y="10" width="45" height="30" rx="5" fill="hsl(var(--muted-foreground))" />
    </svg>
  );
}

function ModernBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="10" y="10" width="60" height="60" rx="12" fill="hsl(var(--accent))" />
      <circle cx="40" cy="40" r="15" fill="hsl(var(--background))" />
      <circle cx="40" cy="40" r="8" fill="hsl(var(--primary))" />
    </svg>
  );
}

function TechBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      width="120"
      height="40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 20 L30 10 L50 20 L70 10 L90 20 L110 10"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="15" r="3" fill="hsl(var(--accent))" />
      <circle cx="60" cy="15" r="3" fill="hsl(var(--accent))" />
      <circle cx="100" cy="15" r="3" fill="hsl(var(--accent))" />
    </svg>
  );
}

export const clientLogos = [
  { name: "Rei do Frango", id: 1, img: ReiDoFrangoIcon },
  { name: "Geométrico", id: 2, img: GeometricBlueIcon },
  { name: "Green", id: 3, img: GreenIcon },
  { name: "Super Tênis", id: 4, img: SuperTenisIcon },
  { name: "Mascote", id: 5, img: MascotIcon },
  { name: "Red Line", id: 6, img: RedLineIcon },
  { name: "Simple Brand", id: 7, img: SimpleBrandIcon },
  { name: "Tech Brand", id: 8, img: TechBrandIcon },
];