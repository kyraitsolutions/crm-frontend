import { useState } from "react";
import { Phone } from "lucide-react";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { useAuthStore } from "@/stores";
import { ToastMessageService } from "@/services";
import { useWhatsAppStore } from "../store/whatsapp.store";
import { SectionHeader } from "./SectionHeader";

interface PhoneNumberSettingsProps {
  isRegistered: boolean;
}

export const PhoneNumberSettings = ({
  isRegistered,
}: PhoneNumberSettingsProps) => {
  const toastService = new ToastMessageService();

  const { accountId } = useAuthStore((state) => state);

  const { registerPhoneNumber } = useWhatsAppStore((state) => state);

  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterNumber = async () => {
    if (!/^\d{6}$/.test(pin)) {
      toastService.error("PIN must be exactly 6 digits");
      return;
    }

    setIsRegistering(true);

    try {
      const data = await registerPhoneNumber({
        accountId: String(accountId),
        pin,
      });

      if (data?.success) {
        toastService.success("Phone number registered successfully");
        setShowPinInput(false);
        setPin("");
      }
    } catch (error: any) {
      toastService.apiError(error?.message || "Failed to register number");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          icon={Phone}
          iconBg="bg-sky-100"
          iconColor="text-sky-500"
          title="Phone Number Configuration"
          description="Manage your WhatsApp Cloud API phone number."
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className={`flex items-center justify-between rounded-xl border p-4 ${
            isRegistered
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div>
            <p
              className={`font-medium ${
                isRegistered ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {isRegistered
                ? "WhatsApp Cloud API Active"
                : "Phone Number Registration Required"}
            </p>

            <p
              className={`text-sm ${
                isRegistered ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {isRegistered
                ? "This phone number is registered and ready to send and receive WhatsApp messages."
                : "Register this phone number to enable WhatsApp Cloud API messaging."}
            </p>
          </div>

          <Switch checked={isRegistered} disabled className="bg-emerald-900!" />
        </div>
        {/* <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <div>
            <p className="font-medium">Register Phone Number</p>

            <p className="text-sm text-muted-foreground">
              Register this number for WhatsApp Cloud API messaging.
            </p>
          </div>

          <Switch checked={isRegistered} />
        </div> */}

        {!isRegistered && (
          <>
            {!showPinInput ? (
              <Button
                onClick={() => setShowPinInput(true)}
                className="actions-btn py-2! px-4! bg-emerald-50! border-emerald-200! text-emerald-600!"
              >
                Register Number
              </Button>
            ) : (
              <div className="rounded-xl border p-4 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    Verification PIN
                  </label>

                  <Input
                    value={pin}
                    maxLength={6}
                    className="input-field w-fit!"
                    placeholder="Enter 6-digit PIN"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPin(value);
                    }}
                  />

                  <p className="mt-2 text-xs text-muted-foreground">
                    This PIN will be used for WhatsApp phone number registration
                    and future migrations.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    disabled={pin.length !== 6 || isRegistering}
                    className="actions-btn py-2! px-4! bg-emerald-50! border-emerald-200! text-emerald-600!"
                    onClick={handleRegisterNumber}
                  >
                    Confirm Registration
                    {isRegistering && <Loader color="#2e361f" />}
                  </Button>

                  <Button
                    className="actions-btn py-2! px-4! bg-red-50! border-red-200! text-red-600!"
                    onClick={() => {
                      setShowPinInput(false);
                      setPin("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Phone } from "lucide-react";
// import { SectionHeader } from "./SectionHeader";
// import { useWhatsAppStore } from "../store/whatsapp.store";
// import { useAuthStore } from "@/stores";
// import { useState } from "react";
// import Loader from "@/components/Loader";
// import type { ApiError } from "@/types";
// import { ToastMessageService } from "@/services";

// interface PhoneNumberSettingsProps {
//   isRegistered: boolean;
// }

// export const PhoneNumberSettings = ({
//   isRegistered,
// }: PhoneNumberSettingsProps) => {
//   const toastService = new ToastMessageService();
//   const { accountId } = useAuthStore((state) => state);
//   const { registerPhoneNumber } = useWhatsAppStore((state) => state);

//   const [isRegistering, setIsRegistering] = useState(false);
//   const handleRegisterNumber = async () => {
//     setIsRegistering(true);
//     try {
//       const data = await registerPhoneNumber({
//         accountId: String(accountId),
//         pin: "123456",
//       });

//       if (data?.success) {
//         toastService.success("Phone number registered successfully");
//       }
//     } catch (error) {
//       const err = error as ApiError;
//       if (err)
//         toastService.apiError(err.message || "Failed to register number");
//     } finally {
//       setIsRegistering(false);
//     }
//   };
//   return (
//     <Card>
//       <CardHeader>
//         <SectionHeader
//           icon={Phone}
//           iconBg="bg-sky-100"
//           iconColor="text-sky-500"
//           title="Phone Number Configuration"
//           description="Manage your WhatsApp Cloud API phone number."
//         />
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
//           <div>
//             <p className="font-medium">Register Phone Number</p>
//             <p className="text-sm text-muted-foreground">
//               Register this number for WhatsApp Cloud API messaging.
//             </p>
//           </div>

//           <Switch checked={isRegistered} />
//         </div>

//         {!isRegistered && (
//           <Button
//             onClick={handleRegisterNumber}
//             className="actions-btn py-2! px-4! bg-emerald-50! border-emerald-200! text-emerald-600!"
//           >
//             Register Number {isRegistering && <Loader color="#629766" />}
//           </Button>
//         )}
//       </CardContent>
//     </Card>
//   );
// };
