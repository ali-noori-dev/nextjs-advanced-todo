"use client";

import animationData from "@/public/animations/auth-animation.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function AuthAnimation() {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
