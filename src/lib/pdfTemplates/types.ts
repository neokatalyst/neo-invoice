export type LineItem = {
  description: string;
  quantity: number;
  price: number;
};

export type Quote = {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  reference?: string;
  items: LineItem[];
  total: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  [key: string]: any;
};
