"use client";

import Image from "next/image";

export default function MessengerButton() {
  return (
    <a
      href="https://m.me/tiemveclimpingrose"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 bg-white rounded-full right-4 z-50"
    >
      <div className=" p-3 rounded-full shadow-lg hover:scale-105 transition-transform">
        <Image src="/mess.svg" alt="Messenger Icon" width={24} height={2} />
      </div>
    </a>
  );
}
