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
}