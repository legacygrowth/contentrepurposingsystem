const MarketingPrompt = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--base-color)] p-6 text-[var(--contrast-color)]">
      <div className="w-full max-w-6xl space-y-6 rounded-3xl border p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-extrabold tracking-wide md:text-5xl">
          Social media has evolved. Have you kept up?
        </h1>
        <p className="mt-4 text-lg text-[var(--contrast-color)]">
          Say goodbye to Photoshop! Explore thousands of image and video
          templates. Create manually in our dashboard or let AI do it for you.
        </p>
        <div className="flex w-full justify-center">
          <img
            className="h-full w-full rounded-2xl object-cover"
            src="/marketingPrompt/63f3ab714bb54bd85c2afa8c_Social Media had changed_7-min-p-2000.png"
            alt="demo"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketingPrompt;
