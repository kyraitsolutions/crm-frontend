import { BackgroundGlow } from "../components/BackgroundGlow";
import ConnectHeader from "../components/ConnectHeader";
import FloatingDots from "../components/FloatingDots";
import StepsGuide from "../components/StepsGuide";
import WhyConnect from "../components/WhyConnect";

interface WhatsappConnectProps {
  onConnect: () => void;
}

export default function WhatsappConnect({ onConnect }: WhatsappConnectProps) {
  return (
    <div className="relative w-full p-4 overflow-hidden">
      {/* Background glow */}
      <BackgroundGlow />

      {/* Floating dots */}
      <FloatingDots />

      {/* Content */}
      <div className="max-w-5xl mx-auto space-y-8">
        <ConnectHeader onConnect={onConnect} />
        <WhyConnect />
        <StepsGuide />
      </div>
    </div>
  );
}
