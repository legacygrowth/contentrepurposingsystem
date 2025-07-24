const HowAIWorks: React.FC = () => {
  return (
    <section className="w-full bg-[var(--base-color)] px-6 py-16 text-center">
      {/* Heading */}
      <h2 className="mb-12 text-4xl font-bold text-[var(--contrast-color)] md:text-5xl">
        How the AI writes your Copy
      </h2>

      {/* Three Columns */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
        {/* Step 1 */}
        <div className="flex w-full flex-col items-center md:w-3/4 lg:w-2/3">
          <span className="text-6xl font-bold text-orange-500">1</span>
          <h3 className="mt-3 text-xl font-bold text-[var(--contrast-color)]">
            Choose your Task
          </h3>
          <p className="mt-3 max-w-lg text-gray-600">
            From ad copy and captions to blogs, emails, and website content—we
            do it all. Just pick the task that suits your needs!
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex w-full flex-col items-center md:w-3/4 lg:w-2/3">
          <span className="text-6xl font-bold text-pink-500">2</span>
          <h3 className="mt-3 text-xl font-bold text-[var(--contrast-color)]">
            Describe your copy
          </h3>
          <p className="mt-3 max-w-lg text-gray-600">
            Be as vague or specific as you want—AI adapts to your needs. Define
            the tone or target audience for a perfect ad.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex w-full flex-col items-center md:w-3/4 lg:w-2/3">
          <span className="text-6xl font-bold text-purple-500">3</span>
          <h3 className="mt-3 text-xl font-bold text-[var(--contrast-color)]">
            Generate text
          </h3>
          <p className="mt-3 max-w-lg text-gray-600">
            Sit back and let AI do the work in seconds. Generate unlimited copy
            in 28 languages to find the perfect fit for your needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowAIWorks;
