import {
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Monitor,
  Phone,
  Smartphone,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { TemplateForm } from "../../validations/template.schema";
import {
  CAROUSEL_MAX_CARDS,
  CAROUSEL_MIN_CARDS,
} from "../../constants/template.constants";
import { isAuthenticationTemplate } from "../../utils/template/auth.utils";

const resolveVariables = (
  text: string,
  vars: { name?: string; exampleValue: string }[],
) => {
  let resolved = text;
  vars.forEach((v, i) => {
    const placeholder = `{{${i + 1}}}`;
    resolved = resolved.replace(
      new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
      v.exampleValue || placeholder,
    );
  });
  return resolved;
};

const ValidationItem: React.FC<{ ok: boolean; label: string }> = ({
  ok,
  label,
}) => (
  <div className="flex items-center gap-2 text-xs">
    {ok ? (
      <CheckCircle size={13} className="text-green-500 shrink-0" />
    ) : (
      <XCircle size={13} className="text-red-400 shrink-0" />
    )}
    <span className={ok ? "text-gray-700" : "text-red-500"}>{label}</span>
  </div>
);

export const TemplatePreviewPanel: React.FC = () => {
  const [viewMode, setViewMode] = useState<"Mobile View" | "Desktop View">(
    "Mobile View",
  );

  const { control } = useFormContext<TemplateForm>();
  const headerText = useWatch({ control, name: "headerText" }) || "";
  const headerVariables = useWatch({ control, name: "headerVariables" }) || [];
  const bodyText = useWatch({ control, name: "bodyText" }) || "";
  const bodyVariables = useWatch({ control, name: "bodyVariables" }) || [];
  const footerText = useWatch({ control, name: "footerText" }) || "";
  const buttons = useWatch({ control, name: "buttons" }) || [];
  const templateType = useWatch({ control, name: "templateType" });
  const category = useWatch({ control, name: "category" });
  const carousel = useWatch({ control, name: "carousel" });
  const authentication = useWatch({ control, name: "authentication" });

  const isCarousel = templateType === "CAROUSEL";
  const isAuth = isAuthenticationTemplate({
    category: category || "",
    templateType: templateType || "",
  });
  const resolvedHeader = resolveVariables(headerText, headerVariables);
  const resolvedBody = isAuth
    ? [
        "*123456* is your verification code.",
        authentication?.addSecurityRecommendation
          ? "For your security, do not share this code."
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    : resolveVariables(bodyText, bodyVariables);
  const resolvedFooter = isAuth
    ? authentication?.addCodeExpiration
      ? `This code expires in ${authentication.codeExpirationMinutes} minutes.`
      : ""
    : footerText;

  const allVarsHaveExamples = isAuth
    ? true
    : [...headerVariables, ...bodyVariables].every(
        (v) => (v.exampleValue || "").trim() !== "",
      );

  const carouselCardsOk =
    !isCarousel ||
    ((carousel?.cards.length || 0) >= CAROUSEL_MIN_CARDS &&
      (carousel?.cards.length || 0) <= CAROUSEL_MAX_CARDS &&
      (carousel?.cards || []).every((card) => Boolean(card.media?.previewUrl)));

  const buttonCount = isAuth
    ? 1
    : isCarousel
      ? carousel?.cards?.[0]?.buttons.length || 0
      : buttons.length;
  const buttonCountOk = isAuth
    ? true
    : isCarousel
      ? buttonCount <= 2
      : buttons.length <= 10;
  const noProhibited = true;
  const followsGuidelines = isAuth
    ? true
    : bodyText.length <= 1024 && carouselCardsOk;
  const hasContent = isAuth ? true : bodyText.trim().length > 0;

  const validationScore = [
    allVarsHaveExamples,
    buttonCountOk,
    noProhibited,
    followsGuidelines,
    hasContent,
    carouselCardsOk,
  ].filter(Boolean).length;

  const approvalChance =
    validationScore >= 4 ? "High" : validationScore >= 2 ? "Medium" : "Low";
  const barColor =
    approvalChance === "High"
      ? "bg-green-500"
      : approvalChance === "Medium"
        ? "bg-yellow-400"
        : "bg-red-400";
  const barWidth =
    approvalChance === "High"
      ? "w-full"
      : approvalChance === "Medium"
        ? "w-1/2"
        : "w-1/4";

  const isMobile = viewMode === "Mobile View";

  const renderButtonPreview = (btn: any, index: number) => {
    const kind = btn.kind || btn.type;
    const icon =
      kind === "URL" || kind === "URL Button" ? (
        <ExternalLink size={12} />
      ) : kind === "PHONE_NUMBER" || kind === "Phone Button" ? (
        <Phone size={12} />
      ) : (
        <MessageSquare size={12} />
      );
    return (
      <button
        key={btn.id || index}
        type="button"
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 border-t border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {icon}
        {btn.label || btn.text || "Button"}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4  p-2 shadow-sm rounded-2xl">
      <div className="border border-primary/20 pb-4 rounded-2xl overflow-hidden">
        <div className="flex rounded-lg  overflow-hidden mb-4">
          {(["Mobile View", "Desktop View"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                viewMode === mode
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {mode === "Mobile View" ? (
                <Smartphone size={13} />
              ) : (
                <Monitor size={13} />
              )}
              {mode}
            </button>
          ))}
        </div>

        <div className="px-3">
          <div
            className={`mx-auto rounded-2xl overflow-hidden shadow-lg bg-[#ECE5DD] ${
              isMobile ? "max-w-65" : "max-w-full"
            }`}
          >
            <div className="bg-[#075E54] flex items-center gap-2 px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center text-xs font-bold text-green-800">
                Y
              </div>
              <span className="text-white text-xs font-semibold flex-1">
                Your Business ✓
              </span>
              <span className="text-green-200 text-xs">⋯</span>
            </div>

            <div className="p-3 min-h-50 space-y-2">
              <div className="bg-white rounded-2xl rounded-tl-none shadow-sm overflow-hidden max-w-[95%]">
                <div className="p-3">
                  {!isCarousel && !isAuth && resolvedHeader && (
                    <p className="text-xs font-semibold text-gray-800 break-all mb-2">
                      {resolvedHeader}
                    </p>
                  )}
                  <pre className="text-xs text-gray-700 leading-relaxed break-all whitespace-pre-line font-serif">
                    {resolvedBody || (
                      <span className="text-gray-400 italic">
                        Message body will appear here...
                      </span>
                    )}
                  </pre>
                  {!isCarousel && resolvedFooter && (
                    <p className="text-xs text-gray-400 mt-2">{resolvedFooter}</p>
                  )}
                  <p className="text-right text-[10px] text-gray-400 mt-1">
                    11:30 AM
                  </p>
                </div>
                {isAuth && (
                  <div className="border-t border-gray-100">
                    {renderButtonPreview(
                      {
                        kind: "QUICK_REPLY",
                        label:
                          authentication?.copyCodeButtonText || "Copy Code",
                      },
                      0,
                    )}
                  </div>
                )}
                {!isAuth && !isCarousel && buttons.length > 0 && (
                  <div className="border-t border-gray-100">
                    {buttons.map(renderButtonPreview)}
                  </div>
                )}
              </div>

              {isCarousel && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(carousel?.cards || []).map((card, index) => (
                    <div
                      key={card.id}
                      className="min-w-40 max-w-40 shrink-0 bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      {card.media?.previewUrl ? (
                        carousel?.mediaFormat === "VIDEO" ? (
                          <video
                            src={card.media.previewUrl}
                            className="h-24 w-full object-cover bg-gray-100"
                          />
                        ) : (
                          <img
                            src={card.media.previewUrl}
                            alt={`Card ${index + 1}`}
                            className="h-24 w-full object-cover bg-gray-100"
                          />
                        )
                      ) : (
                        <div className="h-24 w-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                          Card {index + 1} media
                        </div>
                      )}
                      {carousel?.includeCardBody && (
                        <p className="px-2 py-1.5 text-[10px] text-gray-700 line-clamp-3">
                          {card.bodyText || "Card body..."}
                        </p>
                      )}
                      <div>
                        {card.buttons.map(renderButtonPreview)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Meta Validation
        </p>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all ${barColor} ${barWidth}`}
          />
        </div>
        <p
          className={`text-xs font-medium mb-3 ${approvalChance === "High" ? "text-green-600" : approvalChance === "Medium" ? "text-yellow-600" : "text-red-500"}`}
        >
          {approvalChance} approval chance
        </p>

        <div className="flex flex-col gap-2">
          <ValidationItem
            ok={allVarsHaveExamples}
            label="All variables are used correctly"
          />
          <ValidationItem
            ok={buttonCountOk}
            label={
              isCarousel
                ? `Card buttons within limit (${buttonCount}/2)`
                : `Button count within limit (${buttons.length}/10)`
            }
          />
          {isCarousel && (
            <ValidationItem
              ok={carouselCardsOk}
              label={`Carousel cards ready (${carousel?.cards.length || 0}/${CAROUSEL_MAX_CARDS})`}
            />
          )}
          <ValidationItem
            ok={noProhibited}
            label="No prohibited content detected"
          />
          <ValidationItem
            ok={followsGuidelines}
            label="Following WhatsApp guidelines"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <Clock size={13} />
          <span>
            Approval usually takes{" "}
            <strong className="text-gray-700">Up to 24 hours</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
