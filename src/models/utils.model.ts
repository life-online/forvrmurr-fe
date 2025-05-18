export type CustomTableHeader = {
  name: string;
  sortable: boolean;
  sortValues: string[] | null;
  sortFunction?: (sortBy?: string, sortOrder?: string) => void;
};
