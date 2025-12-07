import { useEffect, useState } from "react";

interface GradientHeadlineProps {
  text: string;
  className?: string;
}

export default function GradientHeadline({ text, className = "" }: GradientHeadlineProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 페이지(컴포넌트) 로드시 1회만 애니메이션을 적용
    setReady(true);
  }, []);

  return (
    <h1
      className={`text-4xl font-extrabold tracking-wide lg:text-5xl gradient-text w-fit ${ready ? "animate-mask-reveal" : ""} ${className}`}
    >
      {text}
    </h1>
  );
}
