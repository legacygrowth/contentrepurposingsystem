type ButtonProps = {
  name: string;
  className?: string;
};

const BtnSecondary: React.FC<ButtonProps> = ({ name, className = "" }) => {
  return (
    <button
      className={`bg-[var(--contrast-color) hover:text-[var(--brand-color)] border border-[var(--contrast-color)] bg-[var(--brand-color)] transition-colors duration-300 hover:border-[var(--brand-color)] hover:bg-[var(--contrast-color)] ${className}`}
    >
      {name}
    </button>
  );
};

export default BtnSecondary;
