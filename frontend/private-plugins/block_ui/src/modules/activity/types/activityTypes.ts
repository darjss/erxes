export interface IActivity {
  _id: string;
  action: string;
  contentId: string;
  module: string;
  metadata: {
    newValue: string;
    previousValue: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface INote {
  _id: string;
  content: string;
  contentId: string;
  createdBy: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}
