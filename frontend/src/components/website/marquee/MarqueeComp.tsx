import { cn } from "@/lib/utils";
import { Marquee } from "../../magicui/marquee";

const reviews = [
  {
    img: "/marquee/1.svg",
  },
  {
    img: "/marquee/2.svg",
  },
  {
    img: "/marquee/3.png",
  },
  {
    img: "/marquee/4.svg",
  },
  {
    img: "/marquee/5.svg",
  },
];

const firstRow = reviews.slice(0, reviews.length);

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <div
      className={cn(
        "relative w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-lg",
        "flex items-center justify-center dark:border-gray-700 dark:bg-gray-900",
      )}
    >
      <img className="w-full object-cover" src={img} alt="Profile" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100">
        <p className="text-lg font-medium text-white">View Profile</p>
      </div>
    </div>
  );
};

export function MarqueeComp() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <div className="mt-4 max-w-xl text-lg text-[var(--contrast-color)]">
        These companies rely on us for their content
      </div>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} img={review.img} />
        ))}
      </Marquee>

      <div className="from-background pointer-events-none absolute inset-y-0"></div>
      <div className="from-background pointer-events-none absolute inset-y-0"></div>
    </div>
  );
}
