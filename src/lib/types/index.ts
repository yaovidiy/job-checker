export type jobItem = {
  generalInfo: {
    title: string;
    companyName: string;
    postDate: string;
    shortDescription: string;
    description: string;
    link: string;
    pubSalary?: {
      min: string;
      max: string;
    };
  };
  analitics: {
    reviews: string;
    applies: string;
    isApplied: boolean;

  };
  additionalInfo: {
    location: string;
    typeOfJob: string;
    experience: string;
    english: string;
  }
  score: number;
}

export type vacancyData = {
  canApply: boolean;
  mainTag: string;
  tags: string[];
  domain: string;
  jobLocType: string;
  jobType: string;
  location: string;
} | null

export type dialogPageData = {
  lastMessageDate: string;
  readMessageData: string;
  isYouLastWroote: boolean;
} | null

export interface FeedProps {
  items: jobItem[];
  totalJobs: number;
  pages: number[];
  currentPage: string | null;
  updateCurrentPage: (page: string) => void;
  clickOnItem: (item: jobItem) => void;
}

export interface CardProps {
  item: jobItem;
  clickOnItem: (item: jobItem) => void;
}

export interface JobProps {
  companyName: string;
  applied: string;
  reviews: string;
  isApplied: boolean;
  score: number;
  url: string;
  moveBack: () => void;
}