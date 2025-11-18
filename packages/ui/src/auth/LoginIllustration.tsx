"use client";

export default function LoginIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-12 md:p-16">
      <div className="relative w-full max-w-md aspect-square">
        <div 
          className="absolute bottom-0 left-[5%] w-[40%] h-[35%] bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-2xl animate-float-slow"
          style={{ animationDelay: '0s' }}
        >
          <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-[40%] right-[30%] w-3 h-3 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
        </div>

        <div 
          className="absolute bottom-[15%] left-[25%] w-[30%] h-[45%] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl animate-float-medium"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="absolute top-[35%] left-[25%] w-3 h-3 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-[35%] right-[25%] w-3 h-3 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
        </div>

        <div 
          className="absolute bottom-[10%] left-[15%] w-[28%] h-[60%] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl shadow-2xl animate-float-slow-reverse"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-[25%] left-[25%] w-4 h-4 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-[25%] right-[25%] w-4 h-4 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gray-800 rounded-full"></div>
        </div>

        <div 
          className="absolute bottom-[18%] right-[10%] w-[32%] h-[50%] bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-3xl shadow-2xl animate-float-medium-reverse"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-white rounded-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-[48%] left-[70%] w-1 h-8 bg-gray-800 rounded-full transform rotate-12"></div>
        </div>

        <div className="absolute top-[10%] right-[15%] w-8 h-8 bg-[var(--primary)]/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[20%] left-[10%] w-6 h-6 bg-yellow-300/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[60%] right-[25%] w-5 h-5 bg-orange-400/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}