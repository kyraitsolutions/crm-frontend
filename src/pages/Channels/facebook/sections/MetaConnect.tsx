import { BackgroundGlow } from "@/pages/Channels/whatsapp/components/BackgroundGlow";
import FloatingDots from "@/pages/Channels/whatsapp/components/FloatingDots";
import ConnectHeader from "../components/ConnectHeader";
import StepsGuide from "../components/StepsGuide";
import WhyConnect from "../components/WhyConnect";

interface MetaConnectProps {
  onConnect: () => void;
}

export default function MetaConnect({ onConnect }: MetaConnectProps) {
  return (
    <div className="relative w-full overflow-hidden py-10">
      <BackgroundGlow />
      <FloatingDots />

      <div className="max-w-5xl mx-auto space-y-8">
        <ConnectHeader onConnect={onConnect} />
        <WhyConnect />
        <StepsGuide />
      </div>
    </div>
  );
}
