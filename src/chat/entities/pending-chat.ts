interface PendingChat {
  clientId: string;
  question: string;
  takenBy?: string;
}

export const pendingChats = new Map<string, PendingChat>();
