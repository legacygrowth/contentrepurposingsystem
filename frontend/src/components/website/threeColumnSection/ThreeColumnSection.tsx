const ThreeColumnSection = () => {
  const data = [
    {
      image: "/featureNav/content/getpaid/643fe73e6c78251cc7c6de1e_Join.png",
      title: "Join",
      description:
        "It’s super simple to join!Just one approval to join the best marketing solution team around.",
    },
    {
      image:
        "/featureNav/content/getpaid/644b84254bdda05bc535bb94_Advertise (1)-2.png",
      title: "Advertise",
      description:
        "Promote via your referral link Share why you use Trounce with your audience or customers.",
    },
    {
      image: "/featureNav/content/getpaid/643fe76acb809e0f993e160d_Earn.png",
      title: "Earn",
      description:
        "30% commission per sale Earn lifetime recurring commission, including renewals.",
    },
  ];

  return (
    <div className="flex justify-center bg-[var(--base-color)] p-8 text-[var(--contrast-color)]">
      <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex h-full flex-col items-center px-4 text-center"
          >
            <img
              src={item.image}
              alt={item.title}
              className="mb-4 h-64 w-64 object-contain"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeColumnSection;
