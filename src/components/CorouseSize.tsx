import React from "react";

type CorouseSizeProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

const sizeMap: Record<NonNullable<CorouseSizeProps["size"]>, string> = {
  sm: "text-sm p-2",
  md: "text-base p-4",
  lg: "text-lg p-6",
};

const CorouseSize: React.FC<CorouseSizeProps> = ({
  size = "md",
  className = "",
  children,
}) => {
  const classes = `${sizeMap[size]} ${className}`.trim();

  return <div className={classes}>{children}</div>;
};

export default CorouseSize;
