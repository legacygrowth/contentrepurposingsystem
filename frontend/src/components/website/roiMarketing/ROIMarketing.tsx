import { cn } from "@/lib/utils";

import {
  IconBrush, // Graphics - Awesome templates for your images.
  IconRobot, // AI Copywriting - Generated marketing text, powered by AI.
  IconCalendarTime, // Scheduling - Automatic on all socials.
  IconChartBar, // Analytics - Real-time metrics on performance.
  IconHash, // Hashtags - Relevant & trending, freshly updated.
  IconShoppingBag, // Ecommerce - Announce about new products.
  IconLink, // Link Shortener - Save space on long links in captions.
  IconUsers, // Collaboration - Create workspaces for members.
} from "@tabler/icons-react";

export default function FeaturesSectionComp() {
  const features = [
    {
      title: "Graphics",
      description: "Awesome templates for your images.",
      icon: <IconBrush />,
    },
    {
      title: "AI Copywriting",
      description: "Generated marketing text, powered by AI.",
      icon: <IconRobot />,
    },
    {
      title: "Scheduling",
      description: "Automatic on all socials.",
      icon: <IconCalendarTime />,
    },
    {
      title: "Analytics",
      description: "Real-time metrics on performance.",
      icon: <IconChartBar />,
    },
    {
      title: "Hashtags",
      description: "Relevant & trending, freshly updated.",
      icon: <IconHash />,
    },
    {
      title: "Ecommerce",
      description: "Announce about new products.",
      icon: <IconShoppingBag />,
    },
    {
      title: "Link Shortener",
      description: "Save space on long links in captions.",
      icon: <IconLink />,
    },
    {
      title: "Collaboration",
      description: "Create workspaces for members.",
      icon: <IconUsers />,
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="mx-auto w-max text-4xl font-extrabold tracking-wide md:text-5xl">
        ROI, ASAP.
      </h1>
      <p className="mx-auto mt-4 w-full max-w-xl text-center text-lg break-words text-[var(--contrast-color)]">
        Introducing Generative Social Media – the fastest way to create content.
        Here's how it works!
      </p>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <>
      <div
        className={cn(
          "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
          (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
          index < 4 && "lg:border-b dark:border-neutral-800",
        )}
      >
        {index < 4 && (
          <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
        )}
        {index >= 4 && (
          <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
        )}
        <div className="relative z-10 mb-4 px-10 text-[var(--contrast-color)] dark:text-[var(--contrast-color)]">
          {icon}
        </div>
        <div className="relative z-10 mb-2 px-10 text-lg font-bold">
          <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-[var(--brand-color)]  dark:bg-neutral-700" />
          <span className="inline-block text-[var(--brand-color)] transition duration-200 group-hover/feature:translate-x-2 dark:text-[var(--contrast-color)]">
            {title}
          </span>
        </div>
        <p className="relative z-10 max-w-xs px-10 text-sm text-[var(--contrast-color)] dark:text-[var(--contrast-color)]">
          {description}
        </p>
      </div>
    </>
  );
};
