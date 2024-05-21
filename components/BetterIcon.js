import React from "react";

// A better way to illustrate with icons
// Pass any SVG icon as children (recommended width/height : w-6 h-6)
// By default, it's using your primary color for styling
const BetterIcon = ({ children, onClick = () => {}, }) => {
  return (
    <div className="flex items-center justify-end  pr-4 pt-4 cursor-pointer" onClick={onClick}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/30 text-primary ">
        {children}
      </div>
    </div>
  );
};

export default BetterIcon;
