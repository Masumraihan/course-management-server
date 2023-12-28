export type TIssue = {
  [key: string]: unknown;
  type?: string;
  path?: string | number;
};

export type TErrorResponse = {
  statusCode: number;
  message: string;
  errorMessage: string;
  errorDetails: {
    [key: string]: unknown;
    issues?: TIssue[];
  };
};
