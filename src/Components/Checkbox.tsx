interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <label className={`checkbox-item${disabled ? " disabled" : ""}`}>
      {label}
      <input
        name={label}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}
