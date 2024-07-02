import React from "react";
import FontIcon from "../FontIcon";


interface FormInputProps {
  label: string;
  name: string;
  value: string;
  type: string;
  placeholder: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
  icon?: Icon;
  error?: string;
}

interface Icon {
  name: string;
  size: string;
  color: string;
}

const FormInput: React.FC<FormInputProps> = ({icon, label, error,name, value, type, placeholder, onChange, required}) => {
  return (
    <div className={`input-wrapper ${required ? 'required' : ''} ${error && 'has-error'}`}>
      <label className='body-m' htmlFor={name}>{label}</label>
      {!icon && (
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          id={name}
          type={type}
          placeholder={placeholder}
        />
      )}

      {icon && (
        <div className='input-icon'>
          <FontIcon {...icon} />
          <input
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            id={name}
            type={type}
            placeholder={placeholder}/>
        </div>)
      }
      {error && <span className='error-message'>{error}</span>}
    </div>
  );
};
export default FormInput;