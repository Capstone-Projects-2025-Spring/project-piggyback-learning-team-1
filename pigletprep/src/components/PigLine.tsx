import Image from "next/image";

export const PigLine = () => (
  <div className="fixed bottom-0 w-full flex justify-center items-end z-10 py-4">
    <div className="flex space-x-4">
      {[...Array(25)].map((_, i) => {
        const rotation = Math.floor(Math.random() * 121) - 60;

        return (
          <div
            key={i}
            className="opacity-60"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <Image
              src="/backgroundPig.png"
              alt="Decorative pig"
              width={50}
              height={50}
            />
          </div>
        );
      })}
    </div>
  </div>
);
