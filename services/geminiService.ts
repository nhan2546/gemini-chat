import { ChatMessage } from '../types';

/**
 * Sends the entire chat history to the backend proxy.
 * The backend will then securely forward this to the Gemini API.
 * @param messages - The history of messages in the chat.
 * @returns The model's response as a string.
 */
export const sendMessage = async (messages: ChatMessage[]): Promise<string> => {
  // The backend proxy is expected to be at `/api/chat.php` relative to the main site's domain.
  // For local development or different domains, you might need to use a full URL and handle CORS.
  const response = await fetch('https://shoptaongon.vn/api/chat.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Backend proxy error:", errorBody);
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) {
      throw new Error(data.error);
  }

  return data.response; // Assuming the PHP proxy returns { response: "..." }
};
