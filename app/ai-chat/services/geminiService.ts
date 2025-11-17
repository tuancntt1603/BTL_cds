import { Message } from '../types';

type StreamChunk = { text: string };

export type Chat = {
  sendMessageStream: (opts: { message: string }) => AsyncIterable<StreamChunk>;
};

export function createChat(initialMessages: Message[] = []): Chat {
  return {
    async *sendMessageStream({ message }: { message: string }) {
      // Post to the backend AI route; be resilient to non-200 and different shapes
      let full = '';
      try {
        const resp = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversationHistory: initialMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        let data: any = null;
        const raw = await resp.text();
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          data = { response: raw };
        }

        if (resp.status === 429) {
          full = (data?.response || 'Hệ thống AI đang quá tải hoặc vượt hạn mức. Vui lòng thử lại sau.').toString();
        } else if (!resp.ok) {
          full = (data?.response || data?.error || 'Đã xảy ra lỗi. Vui lòng thử lại.').toString();
        } else {
          // Prefer response field; fallback to text or error
          full = (data?.response ?? data?.text ?? data?.error ?? '').toString();
          if (!full) {
            full = 'Xin lỗi, phản hồi rỗng từ máy chủ.';
          }
        }
      } catch (e: any) {
        full = 'Xin lỗi, có lỗi kết nối tới máy chủ AI.';
      }

      // Yield the full response as a single chunk
      yield { text: full };
    },
  };
}

export default createChat;
