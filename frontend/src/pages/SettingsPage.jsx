import React from "react";
import { THEMES } from "../const/index";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-6xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        {/* theme grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`group flex flex-col items-center gap-2 p-2 rounded-lg transition-colors text-center w-full
                ${
                  theme === t
                    ? "bg-base-200 ring-2 ring-primary"
                    : "hover:bg-base-200/30"
                }`}
              aria-pressed={theme === t}
            >
              <div
                className="relative h-12 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1">
                  <div className="rounded-sm w-full h-full bg-primary" />
                  <div className="rounded-sm w-full h-full bg-secondary" />
                  <div className="rounded-sm w-full h-full bg-accent" />
                  <div className="rounded-sm w-full h-full bg-neutral" />
                </div>
              </div>

              <span className="text-[12px] font-medium truncate w-full">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold">Preview</h3>

        {/* Outer preview container: apply currently selected theme to inner preview */}
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-6 bg-base-200">
            <div className="max-w-4xl mx-auto">
              {/* Mock Chat UI */}
              <div
                className="bg-base-100 rounded-xl shadow-sm overflow-hidden"
                data-theme={theme}
              >
                {/* Chat Header */}
                <div className="px-5 py-4 border-b border-base-300 bg-base-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages area: larger and centered */}
                <div className="p-6 bg-base-100 min-h-[240px] max-h-[320px] overflow-y-auto">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-end ${
                          message.isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!message.isSent && (
                          <div className="mr-3 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                              J
                            </div>
                          </div>
                        )}

                        <div
                          className={`relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.isSent
                              ? "bg-primary text-primary-content"
                              : "bg-base-200 text-base-content"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                          <div
                            className={`text-[10px] mt-2 ${
                              message.isSent
                                ? "text-primary-content/70"
                                : "text-base-content/70"
                            }`}
                          >
                            12:00 PM
                          </div>
                        </div>

                        {message.isSent && (
                          <div className="ml-3 flex-shrink-0">
                            {/* small placeholder for user's avatar or status */}
                            <div className="w-8 h-8 rounded-full bg-green-300/30" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="px-5 py-4 border-t border-base-300 bg-base-100">
                  <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-11 rounded-full"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />

                    <button
                      className="btn btn-primary h-11 min-h-0 rounded-full px-4 flex items-center justify-center"
                      aria-label="Send preview"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
