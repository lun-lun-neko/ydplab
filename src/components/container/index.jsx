const Container = ({ children, className }) => {
  return (
    <div
      className={`shadow-xl px-8 py-6 rounded-lg min-h-[300px] bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
