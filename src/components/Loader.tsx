import React from "react";

interface LoaderProps {
  color?: string; // any valid CSS color like "#3b82f6" or "rgb(59,130,246)"
  size?: number; // pixel size of the spinner
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  color = "#fff", // default blue
  size = 18,
  className = "",
}) => {
  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderColor: `${color}40`, // light border color (25% opacity)
    borderTopColor: color, // top border solid color for spinner
  };

  return (
    <div
      role="status"
      className={`animate-spin rounded-full border-2 border-solid ${className}`}
      style={style}
    />
  );
};

export default Loader;
