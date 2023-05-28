import React, { useRef, useState } from "react";
import { useOutsideClick } from "../helpers/useOutsideClick";

const defaultTags = [
  "Gaming",
  "Tech",
  "Health",
  "Sports",
  "Music",
  "Food",
  "Travel",
];
export const tagColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-purple-500",
];

const TagInput = ({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [input, setInput] = useState("");
  const suggestions = defaultTags;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useOutsideClick(suggestionsRef, () => {
    setShowSuggestions(false);
  });

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-2 py-1 rounded-md ${tagColors[index]} text-brand-white`}
          >
            <p className="text-xs font-semibold">{tag}</p>
            <button
              type="button"
              onClick={() => {
                setTags((prev) => prev.filter((t) => t !== tag));
              }}
            >
              <svg
                className="w-3 h-3 text-brand-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="relative w-full">
        <input
          type="text"
          className="w-full py-1 mt-2 text-xs font-semibold bg-transparent border-b outline-none text-brand-white border-brand-brown"
          placeholder="Add a tag"
          value={input}
          onClick={() => setShowSuggestions(true)}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!tags.includes(input)) {
                setTags((prev) => [...prev, input]);
              }
              setInput("");
            }
          }}
        />
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 flex flex-wrap w-full gap-2 p-2 mt-2 border rounded-lg bg-brand-dark border-brand-brown"
          >
            {suggestions
              .filter((suggestion) =>
                suggestion.toLowerCase().includes(input.toLowerCase())
              )
              .map((suggestion, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 text-xs font-semibold ${tagColors[index]} bg-opacity-50 hover:bg-opacity-100 text-white rounded-md cursor-pointer w-max `}
                  onClick={() => {
                    if (!tags.includes(suggestion)) {
                      setTags((prev) => [...prev, suggestion]);
                    }

                    setInput("");
                  }}
                >
                  {suggestion}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
