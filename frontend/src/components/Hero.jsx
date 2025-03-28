import React from 'react';


const Hero = () => {

  return (
    <div className="relative min-h-[80vh] pt-16 flex items-center bg-black">
      <div className="section-container relative z-10 flex flex-col items-center text-center">
        {/* Hero Content */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
          Share Your <span className="text-purple-400">Music Journey</span>
        </h1>
        
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mb-8">
          Discover, rate, and review music that moves you. Connect with a community of passionate listeners and create your personal music library.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <a href="#" className="button-primary text-center">
            Start Logging
          </a>
          <a href="#features" className="button-secondary text-center">
            Explore Features
          </a>
        </div>
        
        {/* App Showcase */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="glass rounded overflow-hidden p-1 shadow-md">
            <div className="relative aspect-video rounded overflow-hidden bg-zinc-800/30">
              {/* App showcase/mockup */}
              <div className="absolute inset-10 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 p-3 w-full max-w-3xl">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="album-card aspect-square bg-zinc-800">
                        <img src="vite.svg" alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
