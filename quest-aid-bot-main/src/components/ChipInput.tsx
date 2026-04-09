import { useState } from "react";
import { X } from "lucide-react";

interface ChipInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const ChipInput = ({ values, onChange, placeholder }: ChipInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) {
        onChange([...values, input.trim()]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="border-2 border-input rounded-lg p-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-smooth">
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((value, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            {value}
            <button
              onClick={() => removeValue(index)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-smooth"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={values.length === 0 ? placeholder : ""}
        className="w-full outline-none bg-transparent"
      />
    </div>
  );
};
