  const pricingPlans = [
    {
      title: "Bronze",
      subtitle: "For individuals.",
      price: 15,
      highlighted: false,
      features: [
        "5 social profiles",
        "1 member",
        "1 workspace",
        "100 AI credits",
      ],
    },
    {
      title: "Silver",
      subtitle: "For growing teams.",
      price: 39,
      highlighted: false,
      features: [
        "20 social profiles",
        "5 team members",
        "5 workspaces",
        "500 AI credits",
        "Copywriting in 28+ languages",
        "Plugins inside post editor",
        "Everything from Bronze",
      ],
    },
    {
      title: "Gold",
      subtitle: "For scaling businesses.",
      price: 79,
      highlighted: true,
      features: [
        "50 social profiles",
        "20 team members",
        "20 workspaces",
        "1,500 AI credits",
        "Automations",
        "Everything from Silver",
      ],
    },
    {
      title: "Diamond",
      subtitle: "For large organizations.",
      price: 159,
      highlighted: false,
      features: [
        "150 social profiles",
        "50 team members",
        "Unlimited workspaces",
        "Unlimited AI credits",
        "Advanced analytics",
        "Branded reports",
        "Everything from Gold",
      ],
    },
  ];

  function Common() {
    return (
      <div className="flex w-full flex-wrap gap-6 px-4 md:px-6">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between rounded-lg border text-center shadow-lg ${
              plan.highlighted ? "text-base" : "bg-[var(--base-color)] dark:bg-[var(--contrast-color)]"
            }`}
            style={{
              flex: "1 1 250px",
              minWidth: "250px",
              maxWidth: "100%",
              height: "600px",
            }}
          >
            <div className="flex h-full flex-col p-6">
              <h3 className="text-xl font-semibold text-[var(--contrast-color)] dark:text-[var(--base-color)]">
                {plan.title}
              </h3>
              <p className="text-sm text-gray-500">{plan.subtitle}</p>
              <p className="mt-4 text-3xl font-bold text-[var(--contrast-color)] dark:text-[var(--base-color)]">
                ${plan.price}
              </p>
              <p className="text-sm text-gray-500">per month</p>
              <button
                className={`mt-4 cursor-pointer rounded-lg px-6 py-2 font-semibold text-[var(--contrast-color)] dark:text-[var(--base-color)] ${
                  plan.highlighted
                    ? "border border-[var(--contrast-color)] dark:border-[var(--base-color)] text-[var(--contrast-color)] dark:text-[var(--base-color)]"
                    : "border border-[var(--contrast-color)] dark:border-[var(--base-color)]"
                }`}
              >
                Try free
              </button>
              <ul className="mt-6 flex-grow space-y-2 text-left text-sm">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="border-t pt-2  text-gray-500"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <p className="text-sm text-gray-500">Supported</p>
                <img
                  src="/featureNav/content/pricing/6164ffd667f47b2a3684e934_supported_channels_more.png"
                  alt="Supported Social Media"
                  className="mx-auto mt-2 w-40"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  export default Common;
