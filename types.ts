export interface Service {
  id: string;
  title: string;
  description: string;
  priceEstimate: string; // Text for the modal
  briefingLink: string; // Placeholder for link
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
