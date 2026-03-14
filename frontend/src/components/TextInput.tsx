import { Input } from 'antd';
import type { InputProps } from 'antd';
import './TextInput.css';

interface TextInputProps extends InputProps {
  label?: string;
  error?: string;
}

export default function TextInput({ label, error, ...props }: TextInputProps) {
  return (
    <div className="text-input-wrapper">
      {label && <label className="text-input-label">{label}</label>}
      <Input
        {...props}
        className={`text-input ${props.className ?? ''}`}
        status={error ? 'error' : props.status}
      />
      {error && <span className="text-input-error">{error}</span>}
    </div>
  );
}
