"use client";

import animationData from "@/public/animations/login-animation.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function LottieAnimation() {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
