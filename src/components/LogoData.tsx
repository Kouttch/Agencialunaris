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
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/86bf827f-1738-4b6b-a9f4-6ef96044cb0c.png"
        alt="Tech Brand"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

function ModernBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/3cb41719-1c90-4212-8d14-4c9ef378e4fa.png"
        alt="Modern Brand"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
  );
}

function DigitalBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <img
        src="/lovable-uploads/3f67c125-1e2e-4f31-aa79-54e1923331b3.png"
        alt="Digital Brand"
        className="h-full w-full object-contain max-h-16 max-w-24"
      />
    </div>
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