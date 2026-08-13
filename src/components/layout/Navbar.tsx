import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-verax-blue border-b border-verax-blue-dark text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo de Estudio Verax Grande sin recuadro de fondo */}
        <div className="flex items-center gap-4">
          <div className="h-14 sm:h-16 flex items-center">
            <img 
              src="/assets/logos/estudio_verax.png" 
              alt="Estudio Verax Logo" 
              className="h-full max-h-16 w-auto object-contain drop-shadow-md"
            />
          </div>
          <div className="border-l border-white/20 pl-4">
            <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
              ESTUDIO VERAX
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Generador Automático de Actas de Desistimiento
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
