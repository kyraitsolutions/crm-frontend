export type TFacebookPost = {
  id: string;
  message: string | null;
  story: string | null;
  createdTime: string | null;
  permalink: string | null;
  picture: string | null;
  type: string | null;
  likes: number;
  comments: number;
  shares: number;
  isPublished: boolean;
};

export type TFacebookLeadForm = {
  id: string;
  name: string;
  status: string | null;
  leadsCount: number;
  createdTime: string | null;
  locale: string | null;
  questions: Array<{
    key?: string;
    label?: string;
    type?: string;
  }>;
};

export type TFacebookLead = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  message?: string;
  status?: string;
  stage?: string;
  createdAt?: string;
  source?: {
    name?: string;
    formId?: string;
    pageId?: string;
    leadgenId?: string;
    adId?: string;
    campaignId?: string;
    createdTime?: string | null;
  };
};

export type TFacebookInsightMetric = {
  name: string;
  title: string;
  value: number | string | null;
  period: string | null;
  endTime: string | null;
};

export type TFacebookInsights = {
  page: {
    id: string;
    name: string | null;
    fanCount: number | null;
    followersCount: number | null;
    talkingAboutCount: number | null;
    ratingCount: number | null;
    overallStarRating: number | null;
  };
  metrics: TFacebookInsightMetric[];
  warning: string | null;
};

export type TMetaPagination = {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TMetaPaginatedResponse<T> = {
  docs: T[];
  pagination?: TMetaPagination;
  warning?: string | null;
};

