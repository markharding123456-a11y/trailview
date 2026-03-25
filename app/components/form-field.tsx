import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
