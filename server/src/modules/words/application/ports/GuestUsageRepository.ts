export interface GuestUsageRepositoryPort {
  getWordCount(guestId: string): Promise<number>;
  incrementWordCount(guestId: string): Promise<void>;
}
