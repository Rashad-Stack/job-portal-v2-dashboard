const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-white px-4 py-2 rounded-[8px] ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
