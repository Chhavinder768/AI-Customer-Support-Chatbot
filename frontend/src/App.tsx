import { useState } from "react";
import { sendMessage } from "./api/chat.api";
import { ChatMessage } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend() {
    if (!input.trim() || isTyping) return; // Prevent duplicate submissions

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await sendMessage(
        userMessage.content,
        conversationId
      );

      setConversationId(result.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>AI Customer Support</h2>

        <div style={styles.chatBox}>
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}-${m.content.substring(0, 10)}`}
              style={{
                ...styles.message,
                ...(m.role === "user"
                  ? styles.userMessage
                  : styles.agentMessage),
              }}
            >
              {m.content}
            </div>
          ))}

          {isTyping && (
            <div style={{ ...styles.message, ...styles.agentMessage, opacity: 0.6 }}>
              Agent is typing…
            </div>
          )}
        </div>

        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
            disabled={isTyping}
          />
          <button onClick={handleSend} style={styles.button} disabled={isTyping}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "600px",
    width: "100%",
    maxWidth: "650px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    overflow: "hidden",
  },
  title: {
    marginBottom: 0,
    color: "#fff",
    fontSize: 24,
    fontWeight: 700,
    padding: "18px 20px",
    background: "rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center" as const,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto" as const,
    marginBottom: 0,
    padding: "16px",
    background: "rgba(15,23,42,0.6)",
    borderRadius: 0,
    border: "none",
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  message: {
    marginBottom: 0,
    padding: "12px 14px",
    borderRadius: 12,
    maxWidth: "75%",
    wordWrap: "break-word" as const,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    lineHeight: 1.5,
    fontSize: 13,
  },
  userMessage: {
    backgroundColor: undefined,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    marginLeft: "auto",
    borderBottomRightRadius: 4,
  },
  agentMessage: {
    backgroundColor: undefined,
    background: "rgba(148,163,184,0.12)",
    color: "#e2e8f0",
    marginRight: "auto",
    borderBottomLeftRadius: 4,
    border: "1px solid rgba(148,163,184,0.2)",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "14px 16px",
    background: "rgba(0,0,0,0.2)",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    outline: "none",
    fontSize: 13,
    transition: "all 0.3s ease",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: undefined,
    background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
    color: "#0f172a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(34, 211, 238, 0.25)",
  },
};

export default App;