"use client";

const ButtonGradient = ({ title = "Gradient Button", onClick = () => {}, styles }) => {
  return (
    <button className={`btn btn-gradient animate-shimmer ${styles}`} onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonGradient;
