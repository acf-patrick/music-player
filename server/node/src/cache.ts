const Cache = new Map<
  string,
  {
    lastQuery: string;
    lastResults: any;
  }
>();

export default Cache;
