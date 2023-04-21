import clsx from "clsx";
import React from "react";

type Props = {
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<Props> = ({ label, name, className, ...rest }) => {
  return (
    <div className="w-full grid gap-1">
      {label && (
        <label htmlFor={name} className="text-base font-semibold">
          {label}
        </label>
      )}

      <input
        name={name}
        id={name}
        className={clsx("placeholder:text-gray-400", className)}
        {...rest}
      />
    </div>
  );
};
