import { useState } from "react";
import axios from "axios";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: "flora", text: "Hi 🌱 I'm Flora! Ask me anything about your plants." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: input });
      setMessages([...newMessages, { sender: "flora", text: res.data.reply }]);
    } catch (err) {
      console.error("Error chatting:", err);
      setMessages([...newMessages, { sender: "flora", text: "Oops! Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-2/5 right-6 flex flex-col items-end">
    <div className="sm:h-80 sm:w-90 w-72 h-90 bg-white  shadow-xl rounded-lg border border-gray-200 flex flex-col ">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <span className="font-semibold">🌿 Flora Chat</span>
        <button onClick={onClose} className="hover:text-gray-200">❌</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.sender === "user"
                ? "ml-auto bg-emerald-100 text-emerald-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="text-gray-400 text-sm">Flora is typing...</p>}
      </div>

      {/* Input */}
      <div className="flex border-t">
        <input
          type="text"
          className="flex-1 p-2 outline-none"
          placeholder="Ask Flora..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-emerald-500 text-white px-4 hover:bg-emerald-600"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
}
