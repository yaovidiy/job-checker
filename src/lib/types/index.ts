import type { Snippet } from "svelte";

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
  applied: string;
  reviews: string;
  isApplied: boolean;
  score: number;
  url: string;
  moveBack: () => void;
}

export interface StatProps {
  title: string;
  value: string;
  desc: string;
}
export interface StatsProps {
  items: StatProps[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statSnippet?: Snippet<[any]>;
}