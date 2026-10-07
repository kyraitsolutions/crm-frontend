import type { Node } from "reactflow";

export type TFlowActionType =
  | "keyword"
  | "condition"
  | "set_attribute"
  | "add_tag"
  | "remove_tag"
  | "delay"
  | "goto"
  | "end"
  | "api_request"
  | "handoff"
  | "ask_address"
  | "ask_location"
  | "ask_media"
  | "connect_flow";

export type TNodeType =
  | "send_message"
  | "button"
  | "list"
  | "carousel"
  | "question"
  | "template"
  | TFlowActionType;

export type TMessageType = "text" | "image" | "video" | "document";
export type TMode = "url" | "quick_reply";

export type TQuickReplyButton =
  | {
      type: "quick_reply";
      quick_reply: {
        id: string;
        title: string;
      };
    }
  | {
      type: "reply";
      reply: {
        id: string;
        title: string;
      };
    };

type TUrlButton = {
  name: "cta_url";
  parameters: {
    display_text: string;
    url: string;
  };
};
export type TAction =

  | TUrlButton
  | {
      buttons: TQuickReplyButton[];
      parameters?:any
    };

type TBaseNodeData<TType, TPayload> = {
  label: string;
  type: TType;
  payload: TPayload;
};

// ======================== Send message types start ==========================
export type TSendMessageNodeDataPayload = Array<
  | {
      id: string;
      type: "text";
      content: string;
    }
  | {
      id?: string;
      type: "image";
      image?: {
        link: string;
        caption?: string;
      };
    }
  | {
      id?: string;
      type: "video";
      video?: {
        link: string;
      };
    }
  | {
      id?: string;
      type: "document";
      document?: {
        link: string;
      };
    }
>;
// ======================== Send message types end ==========================

// ========================== Button types start ==========================

export type TFooter = {
  type: "text";
  text: string;
};

export type THeader = {
  type: TMessageType;
  text?: string;
  image?: {
    link?: string;
    id?: string;
  };
  video?: {
    link?: string;
    id?: string;
  };
  document?: {
    link?: string;
    id?: string;
  };
};

export type TButtonNodeDataPayload = {
  type: "interactive";
  interactive: {
    type: "button";
    header: THeader;
    body: {
      text: string;
    };
    footer: TFooter;
    action: TAction;
  };
};
// ========================== Button types end ==========================

//========================= List types start ==========================
export type TListRow = {
  id: string;
  title: string;
  description?: string;
};

export type TListSection = {
  title: string;
  rows: TListRow[];
};

export type TListNodeDataPayload = {
  type: "interactive";
  interactive: {
    type: "list";

    header: THeader;

    body: {
      text: string;
    };

    footer: TFooter;

    action: {
      button: string; // IMPORTANT (this was missing in button logic mindset)
      sections: TListSection[];
    };
  };
};
// ========================= List types end ==========================

//========================= Carousel types start ==========================
export type TCarouselHeader =
  | {
      type: "image";
      image: {
        link: string;
      };
    }
  | {
      type: "video";
      video: {
        link: string;
      };
    };

export type TCarouselCard = {
  card_index: number;
  header: TCarouselHeader;
  type: "cta_url";
  body: {
    text: string;
  };
  action: TAction;
};

export type TCarouselNodeDataPayload = {
  type: "interactive";
  interactive: {
    type: "carousel";
    body: {
      text: string;
    };
    action: {
      cards: TCarouselCard[];
    };
  };
};
// ========================= Carousel types end ==========================

//========================= Question types start ==========================
export type TQuestionInputType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "date-range"
  | "datetime"
  | "buttons"
  | "location"
  | "address"
  | "media";

export type TQuestionNodeDataPayload = {
  type: "question";
  question: {
    text?: string | null;
    inputType?: TQuestionInputType;
    required?: boolean;
    attribute?: string;
    retryMessage?: string;
    maxAttempts?: number;
    options?: string[];
  };
  legacyAsk?: {
    type?: string;
    ask?: { text?: string };
  };
};
// ========================= Question types end ==========================

//========================= Template types start ==========================
export type TSavedTemplate = {
  id: string;
  name: string;
  language: string;
  category?: string;
  preview?: string;
};

export type TTemplateNodeDataPayload = {
  type: "template";
  template: TSavedTemplate | null;
};
// ========================= Template types end ==========================

export type TConditionRule = {
  left: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "empty"
    | "not_empty";
  right: string;
};

export type TFlowActionPayload = {
  type: TFlowActionType;
  condition?: {
    match: "all" | "any";
    rules: TConditionRule[];
  };
  attribute?: {
    key: string;
    value: string;
    scope?: "flow" | "contact" | "conversation";
    dataType?: "text" | "number";
  };
  tag?: { name: string };
  delay?: {
    seconds: number;
    unit?: "seconds" | "minutes" | "hours" | "days";
    amount?: number;
  };
  goto?: { targetNodeId: string };
  keyword?: {
    words: string;
    match?: "exact" | "contains" | "phrase";
    caseSensitive?: boolean;
  };
  request?: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    headers: Array<{ key: string; value: string }>;
    query?: Array<{ key: string; value: string }>;
    body: string;
    timeoutMs: number;
    saveAs: string;
  };
  handoff?: {
    note: string;
    reason?: string;
    priority?: "low" | "normal" | "high";
    customerMessage?: string;
  };
  ask?: { text: string };
  connect?: { chatFlowId: string; name?: string };
};

type TSendMessageNodeData = TBaseNodeData<
  "send_message",
  TSendMessageNodeDataPayload
>;
export type TButtonNodeData = TBaseNodeData<"button", TButtonNodeDataPayload>;
export type TListNodeData = TBaseNodeData<"list", TListNodeDataPayload>;
export type TCarouselNodeData = TBaseNodeData<
  "carousel",
  TCarouselNodeDataPayload
>;
export type TQuestionNodeData = TBaseNodeData<
  "question",
  TQuestionNodeDataPayload
>;
export type TTemplateNodeData = TBaseNodeData<
  "template",
  TTemplateNodeDataPayload
>;
export type TFlowActionNodeData = TBaseNodeData<
  TFlowActionType,
  TFlowActionPayload
>;

export type TAppNodeData =
  | TSendMessageNodeData
  | TButtonNodeData
  | TListNodeData
  | TCarouselNodeData
  | TQuestionNodeData
  | TTemplateNodeData
  | TFlowActionNodeData;

export type TAppNode = Node<TAppNodeData>;

export type TAppEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};
