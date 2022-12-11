export type Message = {
  id: string;
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  text: string;
  createdAt: string;
};
