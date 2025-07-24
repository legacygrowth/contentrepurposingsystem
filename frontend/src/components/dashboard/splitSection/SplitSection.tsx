import { Button } from "@/components/ui/button";

interface SplitSectionProps {
  imageSrc: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  onButtonClick?: () => void;
}

const SplitSection: React.FC<SplitSectionProps> = ({
  imageSrc,
  title,
  description,
  features,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="mb-12 flex h-auto w-full flex-col overflow-hidden rounded-xl border shadow-md md:flex-row">
      {/* Left Panel */}
      <div className="hidden w-full items-center justify-center bg-gray-100 p-4 md:w-2/5 lg:flex">
        <img
          src={imageSrc}
          alt="Section Image"
          className="h-auto max-w-full rounded-lg shadow"
        />
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col items-start justify-center p-6 md:w-3/5">
        <h3 className="mb-3 text-2xl font-semibold text-black dark:text-white">{title}</h3>
        <p className="mb-2 text-gray-600">{description}</p>
        <ul className="mb-5 list-inside list-disc space-y-1 text-gray-700">
          {features.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </div>
    </div>
  );
};

export default SplitSection;
