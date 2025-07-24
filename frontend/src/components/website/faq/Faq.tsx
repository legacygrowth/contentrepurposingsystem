import { useState } from "react";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "What is my commission?",
    answer:
      "You will receive 30% commission on all future sales from any user you refer to Trounce until they unsubscribe. For example, if you refer 100 users who purchase the monthly Silver plan, that's $1,176 pm to your pocket (after the 20% auto-applied discount)!Note: If a referral disputes a transaction, we reserve the right to delete the commission due for that payment.",
  },
  {
    question: "What discount do my refers get?",
    answer:
      "All users you refer will automatically receive 20% off at checkout. This is unique to the affiliate scheme and we don't offer this discount anywhere else, so make sure you use this in your promotional campaigns!",
  },
  {
    question: "How long do the cookies last for?",
    answer:
      "We use cookies to track your referrals. The cookies last for 60 days after someone clicks the link. If they click again, the 60 days start again.",
  },
  {
    question: "Can I use the affiliate link to make a purchase for myself?",
    answer:
      "No. Our provider, rewardful incorporates an advanced protection mechanism that monitors all purchases, along with their corresponding IP addresses and cookies. Additionally, Trounce employs an additional layer of protection by cross-checking LinkedIn accounts associated with a subscription to ensure they match the affiliate program account. If we identify any misuse of the affiliate program, we will promptly suspend those accounts and withhold payouts.",
  },
  {
    question: "Can I bid on 'Trounce' and other related keywords?",
    answer:
      "No, we do not permit bidding on our brand keywords on platforms such as Google Ads. Feel free to bid on any other search terms, including our competitors! Note: we reserve the right to disable affiliate accounts if they are found to be bidding on the 'Trounce' keyword.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Your rewards are calculated and available for cash-out via PayPal at the end of each month.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-2xl py-12">
      <h2 className="mb-6 text-center text-3xl font-bold">Affiliate FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              className="flex w-full items-center justify-between rounded-lg bg-orange-50 p-4 text-lg font-semibold text-gray-900"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <ChevronRight
                className={`transform transition-transform ${openIndex === index ? "rotate-90" : ""} text-orange-500`}
              />
            </button>
            {openIndex === index && (
              <div className="rounded-b-lg bg-white p-4 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
