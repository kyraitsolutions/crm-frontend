import { DangerZone } from "../components/DangerZone";
import { PhoneNumberSettings } from "../components/PhoneNumberSettings";

interface SettingsTabProps {
  data: any;
}

export const SettingsTab = ({ data }: SettingsTabProps) => {
  const isPhoneRegistered =
    data.phoneNumberInfo.platformType !== "NOT_APPLICABLE";

  return (
    <div className="space-y-4">
      <PhoneNumberSettings isRegistered={isPhoneRegistered} />
      <DangerZone />
    </div>
  );
};
