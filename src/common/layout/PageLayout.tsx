import clsx from "clsx";
import React from "react";
import { Component } from "../types/component";

const PageLayout: React.FC<Component> = ({ className, children }) => {
  return (
    <div className={clsx("w-[400px] max-h-[500px]", className)}>{children}</div>
  );
};

export default PageLayout;
