import { ChangeEvent } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatBox = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [login, setLogin] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState<string | null>(null);

  useEffect(() => {
    socket.on("chat-history", (chatHistory) => {
      console.log("chatHistory", chatHistory);

      setMessages(chatHistory.map(({ message }: { message: string }) => message));
    });

    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (username) => {
      setTyping(`${username} está escribiendo...`);
    });

    socket.on("stop-typing", () => {
      setTyping(null);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
      socket.off("typing");
      socket.off("stop-typing");
    }
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat-message", username, message);
      socket.emit("stop-typing");

      setMessages((prev) => [...prev, message]);

      setMessage("");
      setTyping(null);
    }
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage((e.target as HTMLInputElement).value);
    if ((e.target as HTMLInputElement)?.value) {
      socket.emit("typing", username);
    } else {
      socket.emit("stop-typing");
    }
  }

  const saveUsername = () => {
    socket.emit("username", username);
    setLogin(true);
  }

  if (!login) return (
    <div>
      <input
        type="text"
        onChange={e => setUsername((e.target as HTMLInputElement)?.value)}
      />
      <button onClick={saveUsername}>Crear usuario</button>
    </div>
  );

  return (
    <div>
      <h1>Usuario: {username}</h1>
      <h2>Chat en vivo</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      {typing && (
        <div>{typing}</div>
      )}
      <input
        type="text"
        onInput={handleInput}
        placeholder="Escribe tu mensaje"
        value={message}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default ChatBox;