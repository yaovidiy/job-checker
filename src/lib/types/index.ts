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

export type reviewsData = {
  lastComment: lastComment;
  totalComments: number;
}

export type commentAuthor = {
  name: string;
  link: string;
}

export type lastComment = {
  author: commentAuthor;
  comment: string;
  time: string;
}

export type vacanciesDataItem = {
  date: string;
  title: string;
  link: string;
  location: string;
  shortDesc: string;
}

export type vacanciesdData = {
  vacancies: {
    totalVacancies: number;
    vacanciesDataList: vacanciesDataItem[];
  };
  companyScore: string;
}

export type djinniResponse = {
  vacancyData: vacancyData;
  expLevel: string;
  salaryLevel: string;
  dialogData: dialogPageData;
} | null;

export type douResponse = {
  reviewsData: reviewsData | null;
  vacanciesdData: vacanciesdData | null;
} | null

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