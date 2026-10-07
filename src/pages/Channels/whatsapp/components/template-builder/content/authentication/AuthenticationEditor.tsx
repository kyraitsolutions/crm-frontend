import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AUTH_CODE_EXPIRATION_MAX,
  AUTH_CODE_EXPIRATION_MIN,
  AUTH_OTP_TYPES,
  AUTH_VALIDITY_OPTIONS_MINUTES,
} from "@/pages/Channels/whatsapp/constants/template.constants";
import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { createDefaultAuthentication } from "@/pages/Channels/whatsapp/utils/template/auth.utils";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export function AuthenticationEditor() {
  const { control, setValue, getValues } = useFormContext<TemplateForm>();
  const authentication = useWatch({ control, name: "authentication" });

  useEffect(() => {
    if (!getValues("authentication")) {
      setValue("authentication", createDefaultAuthentication(), {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [getValues, setValue]);

  if (!authentication) return null;

  const updateAuth = (patch: Partial<NonNullable<TemplateForm["authentication"]>>) => {
    setValue(
      "authentication",
      { ...authentication, ...patch },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-200 px-5 py-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Code delivery setup
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Only Copy code is available in Kyra. One-tap and zero-tap need an
            Android package name and signature hash.
          </p>
        </div>

        <div className="space-y-2">
          {AUTH_OTP_TYPES.map((option) => {
            const selected = authentication.otpType === option.value;
            const disabled = !option.enabled;

            return (
              <label
                key={option.value}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-white"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="auth-otp-type"
                  className="mt-1 accent-primary"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => {
                    if (!disabled) {
                      updateAuth({ otpType: "COPY_CODE" });
                    }
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {option.title}
                    {disabled && (
                      <span className="ml-2 text-[11px] font-normal text-gray-400">
                        (Advanced — not configured)
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {option.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 px-5 py-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Content</h3>
          <p className="mt-1 text-xs text-gray-500">
            Content for authentication message templates can&apos;t be edited.
            You can add optional security and expiry text below.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <p className="font-medium">*123456* is your verification code.</p>
          {authentication.addSecurityRecommendation && (
            <p className="mt-1 text-xs text-gray-500">
              For your security, do not share this code.
            </p>
          )}
          {authentication.addCodeExpiration && (
            <p className="mt-1 text-xs text-gray-500">
              This code expires in {authentication.codeExpirationMinutes}{" "}
              minutes.
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="mt-3 h-8 rounded-xl! text-xs"
            disabled
          >
            {authentication.copyCodeButtonText || "Copy Code"}
          </Button>
        </div>

        <label className="flex items-start gap-3 text-sm text-gray-700">
          <Checkbox
            checked={authentication.addSecurityRecommendation}
            onCheckedChange={(checked) =>
              updateAuth({ addSecurityRecommendation: checked === true })
            }
          />
          <span>
            <span className="font-medium">Add security recommendation</span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Adds: &quot;For your security, do not share this code.&quot;
            </span>
          </span>
        </label>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-gray-700">
            <Checkbox
              checked={authentication.addCodeExpiration}
              onCheckedChange={(checked) =>
                updateAuth({ addCodeExpiration: checked === true })
              }
            />
            <span>
              <span className="font-medium">Add expiry time for the code</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Shows how long the code remains valid ({AUTH_CODE_EXPIRATION_MIN}
                –{AUTH_CODE_EXPIRATION_MAX} minutes).
              </span>
            </span>
          </label>

          {authentication.addCodeExpiration && (
            <div className="ml-7 grid max-w-xs grid-cols-[1fr_120px] gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Expires in
                </label>
                <Input
                  type="number"
                  min={AUTH_CODE_EXPIRATION_MIN}
                  max={AUTH_CODE_EXPIRATION_MAX}
                  value={authentication.codeExpirationMinutes}
                  onChange={(e) =>
                    updateAuth({
                      codeExpirationMinutes: Number(e.target.value) || 1,
                    })
                  }
                  className="input-field rounded-xl!"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Unit</label>
                <Select value="minutes">
                  <SelectTrigger className="input-field rounded-xl!">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl!">
                    <SelectItem value="minutes">minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-medium text-gray-600">
            Copy code button text (optional)
          </label>
          <Input
            value={authentication.copyCodeButtonText || ""}
            maxLength={25}
            placeholder="Copy Code"
            className="input-field rounded-xl! max-w-sm"
            onChange={(e) =>
              updateAuth({ copyCodeButtonText: e.target.value })
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 px-5 py-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Message validity period
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              If WhatsApp can&apos;t deliver within this time, you won&apos;t be
              charged and the customer won&apos;t see the message.
            </p>
          </div>
          <Switch
            checked={authentication.customValidityPeriod}
            onCheckedChange={(checked) =>
              updateAuth({ customValidityPeriod: checked })
            }
          />
        </div>

        {authentication.customValidityPeriod && (
          <div className="max-w-xs space-y-1.5">
            <label className="text-xs font-medium text-gray-600">
              Validity period
            </label>
            <Select
              value={String(authentication.messageSendTtlMinutes)}
              onValueChange={(value) =>
                updateAuth({ messageSendTtlMinutes: Number(value) })
              }
            >
              <SelectTrigger className="input-field rounded-xl!">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl!">
                {AUTH_VALIDITY_OPTIONS_MINUTES.map((minutes) => (
                  <SelectItem key={minutes} value={String(minutes)}>
                    {minutes} minute{minutes === 1 ? "" : "s"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </section>
    </div>
  );
}
