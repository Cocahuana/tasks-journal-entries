import { useState } from "react";
import { Close } from "flowbite-react-icons/outline";
import { Button } from "../../components/ui";
import { TextField, Label } from "../../components/ui/Input";
import { TaskType } from "../../types";
import { ListBoxItem } from "react-aria-components";
// Create a TextArea component since we don't have one
import { TextArea as AriaTextArea } from "react-aria-components";
import { tv } from "tailwind-variants";

const textareaStyles = tv({
  base: [
    "w-full px-3 py-2 rounded-md border border-gray-300",
    "text-sm text-gray-900 placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    "transition-colors",
    "resize-none",
  ],
  variants: {
    isInvalid: {
      true: "border-red-500 focus:ring-red-500",
    },
  },
});

interface TextAreaProps extends React.ComponentProps<typeof AriaTextArea> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

const TextArea = ({ label, description, errorMessage, ...props }: TextAreaProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}
      <AriaTextArea className={textareaStyles()} {...props} />
      {description && <div className="text-xs text-gray-500">{description}</div>}
      {errorMessage && <div className="text-xs text-red-600">{errorMessage}</div>}
    </div>
  );
};

// Create a Select component using your existing patterns
import { Select as AriaSelect, SelectValue, Button as AriaButton, ListBox } from "react-aria-components";
import { ChevronDown } from "flowbite-react-icons/outline";

const selectStyles = tv({
  base: [
    "w-full px-3 py-2 rounded-md border border-gray-300 bg-white",
    "text-sm text-gray-900",
    "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    "transition-colors",
    "flex items-center justify-between",
  ],
  variants: {
    isInvalid: {
      true: "border-red-500 focus:ring-red-500",
    },
  },
});

interface SelectProps extends React.ComponentProps<typeof AriaSelect> {
  label?: string;
  description?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

const Select = ({ label, description, errorMessage, children, ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}
      <AriaSelect {...props}>
        <AriaButton className={selectStyles()}>
          <SelectValue />
          <ChevronDown className="w-4 h-4" />
        </AriaButton>
        {description && <div className="text-xs text-gray-500">{description}</div>}
        {errorMessage && <div className="text-xs text-red-600">{errorMessage}</div>}
        <ListBox className="border border-gray-300 rounded-md shadow-lg bg-white mt-1 max-h-60 overflow-auto">
          {children}
        </ListBox>
      </AriaSelect>
    </div>
  );
};

interface CreateTaskFormProps {
  onClose: () => void;
  onSubmit: (taskData: { title: string; description: string; type: TaskType }) => void;
  isSubmitting?: boolean;
}

export function CreateTaskForm({ onClose, onSubmit, isSubmitting = false }: CreateTaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: TaskType.OTHER as TaskType,
  });
  const [errors, setErrors] = useState<{ title?: string; type?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; type?: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.type) {
      newErrors.type = "Type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="h-full border-l border-gray-300 bg-white overflow-auto">
      <div className="p-4 border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Close className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Title"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            errorMessage={errors.title}
            isRequired
            // placeholder="Enter task title"
          />
          
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter task description"
            rows={3}
          />
          
          <Select
            label="Type"
            key={formData.type}
            onChange={(value) => handleChange('type', value as string)}
            errorMessage={errors.type}
            isRequired
          >
            <ListBoxItem id={TaskType.POST_JOURNAL_ENTRY}>
              Post Journal Entry
            </ListBoxItem>
            <ListBoxItem id={TaskType.REVERSE_JOURNAL_ENTRY}>
              Reverse Journal Entry
            </ListBoxItem>
            <ListBoxItem id={TaskType.OTHER}>
              Other
            </ListBoxItem>
          </Select>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              variant="primary"
            //   disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onPress={onClose}
            //   disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}