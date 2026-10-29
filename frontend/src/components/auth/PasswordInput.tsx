import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  required?: boolean;
}

export default function PasswordInput({ id, value, onChange, autoComplete, placeholder, required = true }: Props) {
  const [visible, setVisible] = useState(false);
  return <div className="password-field">
    <input className="field" id={id} type={visible ? "text" : "password"} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} placeholder={placeholder} required={required} />
    <button className="password-toggle" type="button" onClick={() => setVisible(current => !current)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>
      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  </div>;
}
