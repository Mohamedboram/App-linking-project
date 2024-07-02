import React from "react";
import "./styles.css";

interface FontProps {
  size?: string;
  name?: string;
  color?: string;
  className?: string;
  clickable?: boolean;
}

const FontIcon: React.FC<FontProps> = ({
                                         name = "",
                                         size = "1.5rem",
                                         color,
                                         className = "",
                                         clickable = true,
                                         ...reset
                                       }) => {
  return (
    <>
      <span
        {...reset}
        className={`app-font-icon icon-${name} ${className} clickable-${clickable}`}
        style={{fontSize: size, color: color ? color : undefined}}
        color={color}
      />
    </>
  );
};

export default FontIcon;
