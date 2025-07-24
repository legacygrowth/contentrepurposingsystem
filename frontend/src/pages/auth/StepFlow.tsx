import React, { useState, useEffect } from "react";
import { Image, FileText, Bot, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed

// Your existing steps array here

const steps = [
  {
    id: 1,
    title: "Socials",
    subtitle: "Step 1",
    icon: <Image size={24} />,
    image: "/dashboard/social-accounts/social.png",
    heading: "AI for social media",
    description:
      "Save time creating your social media posts. Simply describe your ideal posts and let our AI generate those for your social media. Select from thousands of templates with our drag-and-drop editor or create directly in Canva. You can always create your posts manually and upload your media.",
  },
  {
    id: 2,
    title: "Copywriting",
    subtitle: "Step 2",
    icon: <FileText size={24} />,
    image: "/dashboard/social-accounts/copywriting.png",
    heading: "AI agents for copywriting",
    description:
      "Why write captions or blogs? Let our AI agents do the heavy-lifting. You can also create your own agents specific to your business needs to write compelling captions. Alternatively, select from many other plugins we offer.",
  },
  {
    id: 3,
    title: "Automation",
    subtitle: "Step 3",
    icon: <Bot size={24} />,
    image: "/dashboard/social-accounts/automation.png",
    heading: "Automate entirely",
    description:
      "Create automations to consistently post on social media and grow your followers. Now you can start posting completely hands-off. You can even post whenever a new blog post comes out. If you run an ecommerce business - connect your store and produce posts around your products.",
  },
];

export default function StepFlow() {
  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!userDetails.token) {
      navigate("/auth/login");
    }
  });

  const [activeStep, setActiveStep] = useState(1);

  const navigate = useNavigate();

  // 🔐 Get token from navigation state

  const [loading, setLoading] = useState(false);

  // Function to send token to API
  const sendTokenToAPI = async () => {
    setLoading(true);
    try {
      console.log("Token existing");
    } catch (error) {
      console.error("🚨 Error sending token:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (activeStep <= steps.length) {
      const current = steps[activeStep - 1];
      return (
        <>
          {/* Left content */}
          <div className="md:w-1/2">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              {current.heading}
            </h2>
            <p className="leading-relaxed text-gray-600">
              {current.description}
            </p>
            <div className="mt-8 flex gap-3">
              {activeStep > 1 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="rounded bg-black px-4 py-2 text-sm text-white"
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right image */}
          <div className="md:w-1/2">
            <img
              src={current.image}
              alt={current.title}
              className="w-full rounded-lg"
            />
          </div>
        </>
      );
    } else {
      // Final step screen
      return (
        <div className="flex w-full flex-col items-center text-center">
          <img
            src="/dashboard/social-accounts/step_4.png"
            alt="You're good to go"
            className="mb-6 max-w-xs"
          />
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            You're good to go!
          </h2>
          <p className="mb-6 max-w-md text-gray-500">
            Congratulations on starting your journey with Ocoya. Now, go ahead
            and try out the platform.
          </p>
          <button
            onClick={() => navigate("/onboarding/user-details")}
            disabled={loading}
            className="rounded bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-6">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-12">
        {/* Step Navigation */}
        {activeStep <= steps.length && (
          <div className="relative flex w-full items-center justify-between px-4">
            {steps.map((step, index) => {
              const isCompleted = activeStep > step.id;
              const isActive = activeStep === step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      onClick={() => setActiveStep(step.id)}
                      className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border transition-all ${
                        isCompleted
                          ? "border-black bg-black text-white"
                          : isActive
                            ? "border-black text-black"
                            : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={28} /> : step.icon}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-700">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400">{step.subtitle}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-6 h-0.5 w-28 bg-gray-300"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Step Content */}
        <div className="flex w-full flex-col-reverse items-center justify-center gap-10 rounded-xl bg-white p-6 md:flex-row md:items-start md:justify-between md:p-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
