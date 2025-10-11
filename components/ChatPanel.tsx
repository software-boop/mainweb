"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot, Send, Loader2, X } from "lucide-react";

// Brand colors
const BRAND = "#07518a";
const BRAND_DARK = "#053a66";

// API endpoints
const CHAT_API =
  process.env.NEXT_PUBLIC_CHAT_API?.trim() || "http://localhost:8787";
const APP_API =
  process.env.NEXT_PUBLIC_APP_API?.trim() || "http://localhost:8788";

// Animation variants
const fadeVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const sheetVariant = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

const messageVariant = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Types
type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Helper functions
const safeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(
      /(https?:\/\/[^\s)]+)(?=\)|\s|$)/g,
      `<a href="$1" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline" style="color:#60a5fa">$1</a>`
    );

// TypeReveal component for assistant messages
function TypeReveal({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span dangerouslySetInnerHTML={{ __html: safeHtml(displayedText) }} />;
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-slate-400 text-sm ml-2">AI is typing...</span>
    </div>
  );
}

export default function ChatPanel() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<null | "product" | "service">(
    null
  );

  // Form data states
  const [productForm, setProductForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    productName: "",
    quantity: 1,
  });
  const [serviceForm, setServiceForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    serviceName: "",
    quantity: 1,
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session ID
  useEffect(() => {
    const id =
      localStorage.getItem("br_session_id") ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 18));
    localStorage.setItem("br_session_id", id as string);
    setSessionId(id as string);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }, [input]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [history, typing, activeForm]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    if (!text) setInput("");
    const newHistory = [...history, { role: "user", content } as Msg];
    setHistory(newHistory);
    setSending(true);
    setTyping(true);

    try {
      const { data } = await axios.post(`${CHAT_API}/chat`, {
        conversationId: sessionId,
        userText: content,
        history: newHistory,
      });

      const answer = String(data?.answer ?? "I received your message!");
      setHistory((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error: any) {
      const errorMsg = `Error: ${error?.message || "Request failed"}`;
      setHistory((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const submitLead = async (payload: any) => {
    try {
      await axios.post(`${APP_API}/api/leads`, payload);
      return true;
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error || "Submit failed. Please try again.";
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: `Submit failed: ${errorMsg}` },
      ]);
      return false;
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, address, phone, productName, quantity } = productForm;

    if (!name || !email || !address || !phone || !productName || quantity < 1) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      type: "product",
      name,
      email,
      phone,
      productInquiry: {
        category: "General",
        product: productName,
        quantity: Number(quantity),
        notes: `Address: ${address || "—"}`,
      },
    };

    setHistory((prev) => [
      ...prev,
      { role: "user", content: "Submitted: Product Enquiry" },
    ]);

    const success = await submitLead(payload);
    if (success) {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Thanks! Your enquiry has been received.",
        },
      ]);

      const summary = `**Product enquiry**\n- ${productName}\n- Qty: ${quantity}\n- Address: ${
        address || "—"
      }`;
      await sendMessage(summary);
    }

    setActiveForm(null);
    setProductForm({
      name: "",
      email: "",
      address: "",
      phone: "",
      productName: "",
      quantity: 1,
    });
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, address, phone, serviceName, quantity } = serviceForm;

    if (!name || !email || !address || !phone || !serviceName || quantity < 1) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      type: "service",
      name,
      email,
      phone,
      serviceRequest: {
        domain: "General",
        service: serviceName,
        priority: "Normal",
        details: `Address: ${address || "—"} | Qty: ${quantity}`,
      },
    };

    setHistory((prev) => [
      ...prev,
      { role: "user", content: "Submitted: Service Enquiry" },
    ]);

    const success = await submitLead(payload);
    if (success) {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Thanks! Your enquiry has been received.",
        },
      ]);

      const summary = `**Service enquiry**\n- ${serviceName}\n- Qty: ${quantity}\n- Address: ${
        address || "—"
      }`;
      await sendMessage(summary);
    }

    setActiveForm(null);
    setServiceForm({
      name: "",
      email: "",
      address: "",
      phone: "",
      serviceName: "",
      quantity: 1,
    });
  };

  const clearChat = () => {
    setHistory([]);
    setActiveForm(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg flex items-center gap-3 px-4 py-3 text-white font-semibold mb-20"
        style={{ background: BRAND }}
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6" />
        <span className="hidden sm:block">Chat</span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {open ? (
          <motion.div
            {...fadeVariant}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
              aria-label="Close"
            />

            {/* Chat Sheet (stop click from closing) */}
            <motion.div
              {...sheetVariant}
              className="relative w-full max-w-2xl h-[70vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-6 py-4 text-white flex items-center justify-between"
                style={{
                  background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8" />
                  <div>
                    <h2 className="font-semibold text-lg">AI Assistant</h2>
                    <p className="text-sm opacity-90">
                      How can I help you today?
                    </p>
                  </div>
                </div>
                {/* Close button now truly closes the panel */}
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors mr-2"
                  aria-label="Close chat"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div
                ref={chatRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-50 to-indigo-50"
              >
                {/* Welcome message */}
                {history.length === 0 && !activeForm ? (
                  <motion.div
                    variants={messageVariant}
                    initial="initial"
                    animate="animate"
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-700/60 border border-slate-600/50 text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <TypeReveal text="Hello! I'm here to help you with any questions or to assist with product and service enquiries. How can I help you today?" />
                    </div>
                  </motion.div>
                ) : null}

                {/* Chat History */}
                {history.map((msg, index) => (
                  <motion.div
                    key={index}
                    variants={messageVariant}
                    initial="initial"
                    animate="animate"
                    className={`flex items-start gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user"
                          ? "text-white"
                          : "bg-slate-700 text-white"
                      }`}
                      style={msg.role === "user" ? { background: BRAND } : {}}
                    >
                      {msg.role === "user" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                        msg.role === "user"
                          ? "text-white rounded-tr-none"
                          : "bg-slate-700/60 border border-slate-600/50 text-slate-100 rounded-tl-none"
                      }`}
                      style={msg.role === "user" ? { background: BRAND } : {}}
                    >
                      {msg.role === "user" ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: safeHtml(msg.content),
                          }}
                        />
                      ) : (
                        <TypeReveal text={msg.content} />
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {typing ? (
                  <motion.div
                    variants={messageVariant}
                    initial="initial"
                    animate="animate"
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-700/60 border border-slate-600/50 rounded-2xl rounded-tl-none px-4 py-3">
                      <TypingIndicator />
                    </div>
                  </motion.div>
                ) : null}

                {/* Inline Forms */}
                <AnimatePresence>
                  {activeForm === "product" ? (
                    <motion.div
                      key="product-form"
                      variants={messageVariant}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-semibold mb-4 text-slate-800">
                        Product Enquiry
                      </h3>
                      <form
                        onSubmit={handleProductSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={productForm.email}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Address"
                            value={productForm.address}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={productForm.phone}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Product Name"
                            value={productForm.productName}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                productName: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="number"
                            placeholder="Quantity"
                            min={1}
                            value={productForm.quantity}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                quantity: Number(e.target.value),
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveForm(null)}
                            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                            style={{ background: BRAND }}
                          >
                            Send Enquiry
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : null}

                  {activeForm === "service" ? (
                    <motion.div
                      key="service-form"
                      variants={messageVariant}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-semibold mb-4 text-slate-800">
                        Service Enquiry
                      </h3>
                      <form
                        onSubmit={handleServiceSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={serviceForm.name}
                            onChange={(e) =>
                              setServiceForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={serviceForm.email}
                            onChange={(e) =>
                              setServiceForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Address"
                            value={serviceForm.address}
                            onChange={(e) =>
                              setServiceForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={serviceForm.phone}
                            onChange={(e) =>
                              setServiceForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Service Name"
                            value={serviceForm.serviceName}
                            onChange={(e) =>
                              setServiceForm((prev) => ({
                                ...prev,
                                serviceName: e.target.value,
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                          <input
                            type="number"
                            placeholder="Quantity"
                            min={1}
                            value={serviceForm.quantity}
                            onChange={(e) =>
                              setServiceForm((prev) => ({
                                ...prev,
                                quantity: Number(e.target.value),
                              }))
                            }
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a]"
                            style={{ color: BRAND, caretColor: BRAND }}
                            required
                          />
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveForm(null)}
                            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                            style={{ background: BRAND }}
                          >
                            Send Enquiry
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* Input Composer */}
              <div className="border-t border-slate-200 p-4 bg-white">
                <div className="relative mb-3">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                    className="w-full min-h-[44px] max-h-[120px] resize-none rounded-xl border border-slate-300 px-4 py-3 pr-14 focus:outline-none focus:border-[#07518a] focus:ring-1 focus:ring-[#07518a] placeholder-slate-400"
                    style={{ color: BRAND, caretColor: BRAND }}
                    disabled={sending}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={sending || !input.trim()}
                    className={`absolute right-2 bottom-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      sending || !input.trim()
                        ? "bg-slate-300 cursor-not-allowed"
                        : "text-white hover:opacity-90"
                    }`}
                    style={{
                      background: sending || !input.trim() ? undefined : BRAND,
                    }}
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveForm("product")}
                    className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 transition-colors"
                    style={{ borderColor: BRAND, color: BRAND }}
                  >
                    Product Enquiry
                  </button>
                  <button
                    onClick={() => setActiveForm("service")}
                    className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 transition-colors"
                    style={{ borderColor: BRAND, color: BRAND }}
                  >
                    Service Enquiry
                  </button>
                  <button
                    onClick={clearChat}
                    className="ml-auto text-xs px-3 py-1 border rounded-lg hover:bg-slate-50 transition-colors"
                    style={{ borderColor: BRAND, color: BRAND }}
                    title="Clear conversation"
                  >
                    Clear chat
                  </button>
                  <span className="text-xs text-slate-500">
                    &nbsp;Session: <code>{sessionId.slice(0, 8)}...</code>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Custom styles for scrollbar */}
      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}
