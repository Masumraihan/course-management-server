export type TQueryObject = {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  minPrice?: string;
  maxPrice?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
  language?: string;
  provider?: string;
  durationInWeeks?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
};
