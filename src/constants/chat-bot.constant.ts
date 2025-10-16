import type { ChatbotAppearanceSection } from "@/types";
import { Palette, Type, Image, Layout, Settings } from "lucide-react";

export const chatBotAppearanceSections: ChatbotAppearanceSection[] = [
  {
    title: "Colors",
    description: "Define your chatbot's color palette",
    icon: Palette,
    fields: [
      { key: "brandColor", label: "Brand Color", type: "color" },
      { key: "contrastColor", label: "Contrast Color", type: "color" },
      { key: "backgroundColor", label: "Background Color", type: "color" },
      { key: "messageColor", label: "Message Color", type: "color" },
      { key: "userMessageColor", label: "User Message Color", type: "color" },
    ],
  },
  {
    title: "Typography",
    description: "Customize text appearance and style",
    icon: Type,
    fields: [
      {
        key: "typeface",
        label: "Typeface",
        type: "select",
        options: ["Inter", "Arial", "Helvetica", "Roboto", "Open Sans", "Lato"],
      },
      {
        key: "fontWeight",
        label: "Font Weight",
        type: "select",
        options: ["light", "normal", "medium", "semibold", "bold"],
      },
      {
        key: "fontSize",
        label: "Font Size",
        type: "slider",
        min: 12,
        max: 20,
        step: 1,
      },
    ],
  },
  {
    title: "Avatar & Style",
    description: "Customize avatar display and style",
    icon: Image,
    fields: [
      {
        key: "showAvatar",
        label: "Show Avatar",
        type: "select",
        options: ["true", "false"],
      },
      {
        key: "avatarStyle",
        label: "Avatar Style",
        type: "select",
        options: ["bubble", "square", "rounded"],
      },
      {
        key: "avatarUrl",
        label: "Avatar URL",
        type: "text",
      },
    ],
  },
  {
    title: "Widget",
    description: "Configure widget position and launcher",
    icon: Layout,
    fields: [
      {
        key: "showLauncher",
        label: "Show Launcher",
        type: "select",
        options: ["true", "false"],
      },
      {
        key: "widgetPosition",
        label: "Widget Position",
        type: "select",
        options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      },
      {
        key: "launcherSize",
        label: "Launcher Size",
        type: "slider",
        min: 40,
        max: 80,
        step: 4,
      },
    ],
  },
  {
    title: "Advanced",
    description: "Fine-tune visual effects and styling",
    icon: Settings,
    fields: [
      {
        key: "roundedCorners",
        label: "Rounded Corners",
        type: "select",
        options: ["true", "false"],
      },
      {
        key: "borderWidth",
        label: "Border Width",
        type: "slider",
        min: 0,
        max: 5,
        step: 1,
      },
      {
        key: "shadowIntensity",
        label: "Shadow Intensity",
        type: "slider",
        min: 0,
        max: 50,
        step: 5,
      },
      {
        key: "customCSS",
        label: "Custom CSS",
        type: "textarea",
      },
    ],
  },
];
