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
        <header className="bg-blue rounded-2xl p-4 mb-8 shadow-xl border border-gray-600
                  bg-gradient-to-b
                  from-blue
                  to-darkBlue">
          <h1 className="text-4xl font-extrabold" style = {{  justifySelf: 'center'}}>
            Rospopalabra
          </h1>
        </header>

        {/* Contenedor principal */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          
          {/* Columna izquierda: Rosco + Stats */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-blue rounded-2xl p-4 shadow-xl
            bg-gradient-to-b
                  from-blue
                  to-darkBlue">
              <Rosco />
            </div>
            <div className="bg-blue rounded-2xl p-4 shadow-xl
            bg-gradient-to-b
                  from-blue
                  to-darkBlue">
              <Stats />
            </div>
          </div>

          {/* Columna derecha: Jugar */}
          <div className="flex-1">
            <div className="bg-blue rounded-2xl p-4 shadow-xl h-full
            bg-gradient-to-b
                  from-blue
                  to-darkBlue">
              <Jugar />
            </div>
          </div>

        </div>
      </div>
    </JuegoProvider>
  );

  export default App;
