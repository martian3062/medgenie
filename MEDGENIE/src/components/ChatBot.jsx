import { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(() => {
    try {
      const saved = localStorage.getItem("chatHistory");   // ✅ FIXED
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [model, setModel] = useState("qwen-32b");
  const [fullscreen, setFullscreen] = useState(false);

  const endRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typing]);

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(chat)); // ✅ FIXED
    } catch {}
  }, [chat]);

  // Speech-to-text
  const startSTT = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.start();

      rec.onresult = (e) => setInput(e.results[0][0].transcript);
    } catch {
      alert("Speech recognition not supported.");
    }
  };

  // Text-to-speech
  const speak = (msg) => {
    const u = new SpeechSynthesisUtterance(msg);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  const sendMsg = async () => {
    if (!input.trim()) return;

    const userText = input;

    setChat((p) => [...p, { sender: "user", text: userText }]);
    setInput("");
    setTyping(true);
    setLoading(true);

    setTimeout(async () => {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: model, message: userText }),
      });

      const data = await res.json();
      const aiReply = data.reply || "AI error.";

      setChat((p) => [...p, { sender: "ai", text: aiReply }]);

      speak(aiReply);

      setTyping(false);
      setLoading(false);
    }, 400);
  };

  return (
    <div
      className={`p-6 ${
        fullscreen ? "fixed inset-0 bg-white z-50" : "max-w-3xl mx-auto"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🤖 MedGenie AI Chat</h1>

        <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={() => setFullscreen(!fullscreen)}
        >
          {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* Model Selector */}
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="border p-2 rounded mb-3"
      >
        <option value="qwen-32b">Qwen 32B</option>
        <option value="llama-3">LLaMA 3</option>
        <option value="mixtral">Mixtral</option>
      </select>

      {/* CHAT BOX */}
      <div className="bg-gray-100 h-[500px] p-4 rounded shadow overflow-y-auto">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 my-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "ai" && (
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                🤖
              </div>
            )}

            <div
              className={`p-3 rounded-xl max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                🧑
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
              🤖
            </div>
            <div className="bg-white border px-3 py-2 rounded-xl animate-pulse">
              AI is typing…
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      {/* INPUT BAR */}
      <div className="flex gap-3 mt-4">
        <input
          className="flex-1 border p-3 rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
          placeholder="Ask anything…"
        />

        <button
          onClick={startSTT}
          className="bg-gray-700 text-white px-4 py-3 rounded-lg"
        >
          🎤
        </button>

        <button
          onClick={sendMsg}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
