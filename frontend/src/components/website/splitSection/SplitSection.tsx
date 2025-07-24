interface SplitSectionProps {
  imageSrc: string;
  title: string;
  description: string;
  reverse: boolean;
  btn?: boolean;
  btnText?: string; // Added button text prop (optional)
}

const SplitSection: React.FC<SplitSectionProps> = ({
  imageSrc,
  title,
  description,
  reverse,
  btn,
  btnText,
}) => {
  return (
    <section className="container mx-auto flex w-full items-center justify-center bg-[var(--base-color)] px-6 py-12 text-[var(--contrast-color)]">
      <div
        className={`flex flex-col ${
          reverse ? "sm:flex-row-reverse" : "sm:flex-row"
        } items-center gap-6 md:gap-12 md:px-20 lg:px-32`}
      >
        {/* Image Section */}
        <div className="h-auto w-4/5 md:w-1/2 lg:w-2/5">
          <img
            src={imageSrc}
            alt={title}
            className="h-auto w-full rounded-lg shadow-md"
          />
        </div>

        {/* Text Section */}
        <div className="w-full text-center md:w-1/2 md:text-left">
          <h2 className="mb-4 text-3xl font-bold">{title}</h2>
          <p className="text-lg">{description}</p>

          {/* Button Section (Now Left Aligned) */}
          {btn && btnText && (
            <div className="mt-6 flex max-w-2xl flex-col items-center justify-start space-y-3 tracking-wide sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
              <button className="border-contrast h-12 w-40 cursor-pointer rounded-full border text-[var(--contrast-color)] transition-colors duration-300 hover:bg-[var(--contrast-color)] hover:text-[var(--base-color)]">
                {btnText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SplitSection;
