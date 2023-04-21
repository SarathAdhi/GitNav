import clsx from "clsx";
import React from "react";

type Props = {
  colorScheme?: "green" | "red" | "gray";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = ({
  className,
  colorScheme = "gray",
  children,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        colorScheme === "green" && "bg-green-600 hover:bg-green-500 text-white",
        colorScheme === "red" && "bg-red-600 hover:bg-red-500 text-white",
        colorScheme === "gray" && "bg-gray-300 hover:bg-gray-100 text-black",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
