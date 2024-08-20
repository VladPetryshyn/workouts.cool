import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes, Ref } from "react";
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

export const TextField = forwardRef(function TextField(
  { label, placeholder, id, error, ...props }: Props,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <div className="defaultTextFieldContainer">
      <input
        placeholder={placeholder}
        id={id}
        type="email"
        className={classNames("defaultTextFieldInput", { error: !!error })}
        ref={ref}
        {...props}
      />
      <label htmlFor={id} className="defaultTextFieldErrorLabel">
        {error}
      </label>
    </div>
  );
});
