  import React from 'react';
  import { JuegoProvider } from './context/JuegoContext';
  import Rosco from './components/Rosco';
  import Stats from './components/Stats';
  import Jugar from './components/Jugar';

  const App = () => (
    <JuegoProvider>
        <div className="min-h-screen text-white p-4 md:p-4
                  bg-gradient-to-b
                  from-[#EB0B92]
                  to-[#4B57B0]">
        {/* Header */}
        <header className="bg-blue rounded-2xl p-4 mb-2 md:mb-8 shadow-xl border border-gray-600 bg-gradient-to-b from-blue to-darkBlue select-none">
          <h1 className="text-4xl font-extrabold" style = {{  justifySelf: 'center'}}>
            Rospopalabra
          </h1>
        </header>

        {/* Contenedor principal */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          
          {/* Columna izquierda: Rosco + Stats */}
          <div className="bg-gradient-to-b from-blue to-darkBlue rounded-2xl shadow-lg overflow-hidden md:flex md:flex-col flex-1 flex flex-col select-none">
            {/* Rosco con separación abajo en móvil */}
            <div className="p-4 md:p-0 border-none">
              <Rosco />
            </div>
            {/* Stats */}
            <div className="p-4 md:p-0">
              <Stats />
            </div>
          </div>

          {/* Columna derecha: Jugar */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-blue to-darkBlue rounded-2xl p-4 shadow-xl h-full">
              <Jugar />
            </div>
          </div>

        </div>
      </div>
    </JuegoProvider>
  );

  export default App;
