"use client";
import { ThreeDMarquee } from "../../ui/3d-marquee";

// import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export default function ThreeDMarqueeComp() {
  const images = [
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
    "/integrations/62521d10f537163dc969c0dc_linkedin.svg",
    "/integrations/62521d10f53716d3f269c0da_instagram.svg",
    "/integrations/62521d10f53716fc8c69c0db_twitter.svg",
    "/integrations/62521d10f53716755669c0e1_facebook.svg",
  ];
  return (
    <div className="flex flex-col h-screen justify-center rounded-3xl w-full items-center max-w-7xl mx-auto my-10 overflow-hidden relative">
      <h2 className="text-2xl text-balance text-center text-white font-bold lg:text-6xl max-w-4xl md:text-4xl mx-auto relative z-20">
        This is your life and it&apos;s it's fading away one{" "}
        <span className="bg-[var(--brand-color)]  rounded-xl text-white backdrop-blur-sm decoration-[6px] decoration-[var(--brand-color)]  inline-block px-4 py-1 relative underline underline-offset-[16px] z-20">
          moment
        </span>{" "}
        at a time.
      </h2>
      <p className="text-center text-neutral-200 text-sm max-w-2xl md:text-base mx-auto py-8 relative z-20">
        You are not your job, you&apos;re not how much money you have in the
        bank. You are not the car you drive. You&apos;re not the contents of
        your wallet.
      </p>

      <div className="flex flex-wrap justify-center gap-4 items-center pt-4 relative z-20">
        <button className="bg-white/10 border border-white/20 rounded-md text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/20 font-medium hover:bg-white/20 px-6 py-2.5 transition-colors">
          Read more
        </button>
      </div>

      {/* overlay */}
      <div className="bg-black/80 h-full w-full absolute dark:bg-black/40 inset-0 z-10" />
      <ThreeDMarquee
        className="h-full w-full absolute inset-0 pointer-events-none"
        images={images}
      />
    </div>
  );
}
