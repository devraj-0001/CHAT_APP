import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const { socket, authUser } = useAuthStore();
  const { selectedUser } = useChatStore();

  // console.log("selectedUser", selectedUser);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select and image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // when typing in input
  const handleChangeInput = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      senderId: authUser._id,
      senderName: selectedUser.fullName,
      receiverId: selectedUser._id,
      isTyping: true,
    });
  };

  useEffect(() => {
    let timeout;

    socket.on("typing", (data) => {
      console.log("Typing event received:", data);

      // show typing only if:
      // 1) it's not me typing
      // 2) I'm currently chatting with the sender
      if (
        data?.isTyping &&
        data.senderId !== authUser._id &&
        data.senderId === selectedUser._id
      ) {
        setIsTyping(true);
        setTypingUser(`${data.senderName} is typing...`);

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsTyping(false);
          setTypingUser("");
        }, 2000);
      }
    });

    return () => {
      socket.off("typing");
      clearTimeout(timeout);
    };
  }, [socket, authUser._id, selectedUser._id]);

  console.log(typingUser);

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "s";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  };

  return (
    <div id="boxi" className="p-4 w-full">
      {isTyping && <TypingIndicator text={typingUser} />}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            id="input"
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            // onChange={(e) => setText(e.target.value)}
            onChange={handleChangeInput}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;

function TypingIndicator({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 border border-slate-800 shadow-lg mb-2">
      <span className="flex space-x-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
      </span>
      <span className="text-xs text-slate-300 opacity-80">{text}</span>
    </div>
  );
}
