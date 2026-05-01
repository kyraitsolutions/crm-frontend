import type { Node } from "reactflow";

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
    };

type TBaseNodeData<TType, TPayload> = {
  label: string;
  type: TType;
  payload: TPayload;
};

// ======================== Send message types start ==========================
type TSendMessageNodeDataPayload = Array<
  | {
      id: string;
      type: "text";
      content: string;
    }
  | {
      id: string;
      type: "image";
      image: {
        url: string;
        caption?: string;
      };
    }
  | {
      id: string;
      type: "video";
      video: {
        url: string;
      };
    }
>;
// ======================== Send message types end ==========================

// ========================== Button types start ==========================
// export type TButton = {
//   type: "reply";
//   reply: {
//     id: string;
//     title: string;
//   };
// };

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
export type TQuestionNodeDataPayload = {
  type: "question";
  question: {
    text?: string | null;
    inputType: "text" | "number" | "email" | "phone" | "date";
  };
};
// ========================= Question types end ==========================

type TSendMessageNodeData = TBaseNodeData<
  "send_message",
  TSendMessageNodeDataPayload
>;
type TButtonNodeData = TBaseNodeData<"button", TButtonNodeDataPayload>;
type TListNodeData = TBaseNodeData<"list", TListNodeDataPayload>;
type TCarouselNodeData = TBaseNodeData<"carousel", TCarouselNodeDataPayload>;
type TQuestionNodeData = TBaseNodeData<"question", TQuestionNodeDataPayload>;

export type TAppNodeData =
  | TSendMessageNodeData
  | TButtonNodeData
  | TListNodeData
  | TCarouselNodeData
  | TQuestionNodeData;

export type TAppNode = Node<TAppNodeData>;

export type TAppEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};
