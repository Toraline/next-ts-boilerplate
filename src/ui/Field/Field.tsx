import { Input } from "ui/Input/Input";

type FieldProps = {
  onChange: () => void;
};

export const Field = ({ onChange }: FieldProps) => {
  return <Input value={""} onChange={onChange} onClick={(e) => e.stopPropagation()}></Input>;
};
