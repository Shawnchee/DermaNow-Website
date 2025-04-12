// src/components/Chat.tsx
import { useState } from "react";
import openai from "../utils/openai";

const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      setResponse(completion.choices[0].message.content || "");
    } catch (error) {
      console.error("OpenAI error:", error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask me anything..."
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>
      <p className="mt-4 whitespace-pre-wrap">{response}</p>
    </div>
  );
};

export default Chat;
