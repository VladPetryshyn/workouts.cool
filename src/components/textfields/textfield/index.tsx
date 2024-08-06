import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import "./textfield.scss";
import classNames from "classnames";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  placeholder: string;
  className?: string;
  id?: string;
  error?: string;
}

export const TextField: FC<Props> = ({
  label,
  placeholder,
  id,
  error,
  ...props
}) => {
  return (
    <div className="defaultTextFieldContainer">
      <input
        placeholder={placeholder}
        id={id}
        type="email"
        className={classNames("defaultTextFieldInput", { error: !!error })}
        {...props}
      />
      <label htmlFor={id} className="defaultTextFieldErrorLabel">
        {error}
      </label>
    </div>
  );
};
