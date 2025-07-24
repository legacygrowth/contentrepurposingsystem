type ButtonProps = {
  name: string;
  className?: string;
};

const BtnPrimary: React.FC<ButtonProps> = ({ name, className = "" }) => {
  return (
    <button
      className={`border-contrast border border-[var(--contrast-color)] text-[var(--contrast-color)] transition-colors duration-300 hover:bg-[var(--contrast-color)] hover:text-[var(--base-color)] ${className}`}
    >
      {name}
    </button>
  );
};

export default BtnPrimary;
