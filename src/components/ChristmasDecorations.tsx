import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
}

export function ChristmasDecorations() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate snowflakes
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 10 + Math.random() * 20,
        size: 10 + Math.random() * 20,
        delay: Math.random() * 10,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      {/* Snowflakes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white opacity-80 animate-fall"
            style={{
              left: `${flake.left}%`,
              fontSize: `${flake.size}px`,
              animationDuration: `${flake.animationDuration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      

      {/* Ornaments */}
      <div className="hidden xl:block fixed top-40 left-8 pointer-events-none z-40 opacity-60">
        <div className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🎁</div>
      </div>
      
      <div className="hidden xl:block fixed top-60 right-8 pointer-events-none z-40 opacity-60">
        <div className="text-4xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>⛄</div>
      </div>

      <div className="hidden xl:block fixed bottom-32 left-12 pointer-events-none z-40 opacity-60">
        <div className="text-3xl animate-pulse" style={{ animationDuration: '2s' }}>🔔</div>
      </div>

      <div className="hidden xl:block fixed bottom-32 right-12 pointer-events-none z-40 opacity-60">
        <div className="text-3xl animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }}>🎅</div>
      </div>

      {/* Candy Canes */}
      <div className="hidden xl:block fixed top-1/3 left-4 pointer-events-none z-40 opacity-50">
        <div className="text-3xl" style={{ transform: 'rotate(-15deg)' }}>🍬</div>
      </div>

      <div className="hidden xl:block fixed top-1/2 right-4 pointer-events-none z-40 opacity-50">
        <div className="text-3xl" style={{ transform: 'rotate(15deg)' }}>🍬</div>
      </div>

      {/* Stars */}
      <div className="hidden lg:block fixed top-32 left-1/4 pointer-events-none z-40 opacity-40">
        <div className="text-2xl animate-twinkle">⭐</div>
      </div>

      <div className="hidden lg:block fixed top-44 right-1/4 pointer-events-none z-40 opacity-40">
        <div className="text-2xl animate-twinkle" style={{ animationDelay: '1s' }}>⭐</div>
      </div>

      <div className="hidden lg:block fixed bottom-40 left-1/3 pointer-events-none z-40 opacity-40">
        <div className="text-2xl animate-twinkle" style={{ animationDelay: '2s' }}>⭐</div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-fall {
          animation: fall linear infinite;
        }

        .animate-swing {
          animation: swing 4s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
