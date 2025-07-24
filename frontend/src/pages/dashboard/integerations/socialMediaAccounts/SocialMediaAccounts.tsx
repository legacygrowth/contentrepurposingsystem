import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { ArrowRight, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SplitSection from "@/components/dashboard/splitSection/SplitSection";
import FB from "./FB/FB";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/utils/api";

const profiles = [
  {
    name: "facebook page",
    image: "/dashboard/social-accounts/facebook.png",
  },
  {
    name: "instagram page",
    image: "/dashboard/social-accounts/insta.png",
  },
  {
    name: "facebook page",
    image: "/dashboard/social-accounts/facebook.png",
  },
  {
    name: "facebook page",
    image: "/dashboard/social-accounts/facebook.png",
  },
  {
    name: "instagram page",
    image: "/dashboard/social-accounts/insta.png",
  },
  {
    name: "facebook page",
    image: "/dashboard/social-accounts/facebook.png",
  },
  {
    name: "instagram page",
    image: "/dashboard/social-accounts/insta.png",
  },
];

const cardProfiles = [
  {
    name: "Facebook page",
    image: "/dashboard/social-accounts/facebook.png",
    date: "3 days ago",
  },
  {
    name: "Instagram page",
    image: "/dashboard/social-accounts/insta.png",
    date: "1 day ago",
  },
  {
    name: "Instagram page",
    image: "/dashboard/social-accounts/insta.png",
    date: "Just now",
  },
  {
    name: "Facebook page",
    image: "/dashboard/social-accounts/facebook.png",
    date: "Just now",
  },
  {
    name: "Instagram page",
    image: "/dashboard/social-accounts/insta.png",
    date: "Just now",
  },
  {
    name: "Facebook page",
    image: "/dashboard/social-accounts/facebook.png",
    date: "Just now",
  },
];

const SocialMediaAccounts = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.user);
  // const [accountConnected, setAccountConnected] = useState([{}]);
  const [showSplitSection, setShowSplitSection] = useState(false);
  useEffect(() => {
    // When Twitter connection is successful
    const handleTwitterConnect = async () => {
      try {
        const result = await apiService.social.twitterConnect(
          oauthToken,
          oauthVerifier,
        );

        dispatch(
          setUser({
            twitterAccessToken: result.oauth.oauth_token,
            twitterAccessTokenSecret: result.oauth.oauth_token_secret,
            twitterUsername: result.oauth.screen_name,
            twitterUserId: result.oauth.user_id,
            twitterProfileImage: result.userDetails.data.profile_image_url,
          }),
        );
      } catch (error) {
        console.error("Twitter connect failed:", error);
      }
    };

    // Call this when Twitter connection is completed
    handleTwitterConnect();
  }, [dispatch]);

  useEffect(() => {
    if (!userDetails.token) {
      navigate("/auth/login");
    }
    // Check if user has any connected accounts
    const hasConnectedAccounts = userDetails.twitterUsername; // Add other platforms here as you implement them

    // Show SplitSection only if user has NO connected accounts
    setShowSplitSection(!hasConnectedAccounts);

    if (userDetails.twitterUsername) {
      console.log("Twitter account connected:", {
        username: userDetails.twitterUsername,
        userId: userDetails.twitterUserId,
        accessToken: userDetails.twitterAccessToken,
        profileImage: userDetails.twitterProfileImage,
      });
    }
  }, [userDetails]);

  //const location = useLocation();
  const navigate = useNavigate();
  //const { token } = location.state || {};

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(Array(profiles.length).fill(true));
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  const toggleSelectAll = () => {
    const allSelected = selected.every(Boolean);
    setSelected(Array(profiles.length).fill(!allSelected));
  };

  const toggleSingle = (index: number) => {
    const updated = [...selected];
    updated[index] = !updated[index];
    setSelected(updated);
  };

  const handleConnectTwitter = async () => {
    try {
      // Pass true to indicate connect flow
      await apiService.auth.loginWithTwitter(true);
    } catch (error) {
      console.error("Twitter connect failed:", error);
    }
  };
  const socialPlatforms = [
    {
      name: "Facebook Page",
      type: "Social",
      image: "/dashboard/social-accounts/facebook.png",
      available: true,
    },
    {
      name: "Instagram Business",
      type: "Social",
      image: "/dashboard/social-accounts/insta.png",
      available: true,
    },
    {
      name: "X (Twitter)",
      type: "Social",
      image: "/dashboard/social-accounts/twitter1.png",
      available: true,
      onClick: handleConnectTwitter,
    },
    {
      name: "LinkedIn",
      type: "Social",
      image: "/dashboard/social-accounts/linkedin.png",
      available: true,
    },
    {
      name: "Pinterest",
      type: "Social",
      image: "/dashboard/social-accounts/pintrest.png",
      available: true,
    },
    {
      name: "Threads",
      type: "Social",
      image: "/dashboard/social-accounts/threads.png",
      available: false,
    },
    {
      name: "Google Business",
      type: "Social",
      image: "/dashboard/social-accounts/google-business.png",
      available: false,
    },
    {
      name: "Youtube Shorts",
      type: "Social",
      image: "/dashboard/social-accounts/youtube.png",
      available: false,
    },
    {
      name: "Discord",
      type: "Community",
      image: "/dashboard/social-accounts/discord.png",
      available: false,
    },
    {
      name: "Telegram",
      type: "Community",
      image: "/dashboard/social-accounts/telegram.png",
      available: false,
    },
    {
      name: "Slack",
      type: "Community",
      image: "/dashboard/social-accounts/slack.png",
      available: false,
    },
  ];
  return (
    <>
      <div className="flex flex-col items-center justify-center p-6">
        {showSplitSection ? (
          <SplitSection
            imageSrc="/dashboard/social-accounts/socials.8509b0e0.png"
            title="Connect your social profiles"
            description="Connecting socials just got easier, thanks to our integrations made just for you."
            features={[
              "Choose from different post variations",
              "Determine posting schedule",
              "Use pre-designed templates",
            ]}
            buttonText="Connect"
            onButtonClick={() => setOpen(true)}
          />
        ) : (
          <>
            {/* <FB /> */}

            {/* Profile Selector */}
            {/* <div className="w-full rounded-lg border-2 border-blue-600 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Select profiles</h2>
                <p className="text-sm">
                  Pick the profiles you want to connect. If you’re missing any
                  you can follow our Help Guides to reset access.
                </p>
              </div>

              <div className="mb-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selected.every(Boolean)}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 accent-black"
                />
                <span className="text-sm font-medium text-black">
                  {selected.every(Boolean) ? "Deselect all" : "Select all"} (
                  {selected.filter(Boolean).length} / {profiles.length})
                </span>
              </div>

              <div className="space-y-3 rounded-md p-4">
                {profiles.map((profile, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 rounded-md px-4 py-3 shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selected[index]}
                      onChange={() => toggleSingle(index)}
                      className="h-4 w-4 accent-black"
                    />
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-black">
                      {profile.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button className="mt-4">Connect</Button>
            </div> */}

            {/* Cards Section */}
            <div className="mt-5 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userDetails.twitterUsername && (
                <div className="relative min-h-[180px] rounded-lg border bg-white p-6 shadow-sm">
                  <div className="absolute top-3 right-3 z-10">
                    {/* ... (3-dot menu) */}
                  </div>
                  <div className="flex flex-col gap-2">
                    <img
                      src={
                        userDetails.twitterProfileImage ||
                        "/dashboard/social-accounts/twitter1.png"
                      }
                      alt="Twitter profile"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <p className="text-lg font-medium text-gray-800">
                      @{userDetails.twitterUsername}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Connected via Twitter
                  </p>
                </div>
              )}
              {/* {cardProfiles.map((entry, index) => (
                <div
                  key={index}
                  className="relative min-h-[180px] rounded-lg border bg-white p-6 shadow-sm"
                > */}
              {/* 3-dot menu */}
              {/* <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() =>
                        setMenuOpenIndex(menuOpenIndex === index ? null : index)
                      }
                      className="rounded p-1 text-gray-500 hover:text-black"
                    >
                      ...
                    </button>

                    {menuOpenIndex === index && (
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border bg-white shadow-md">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("API_PROFILE_ID");
                            setMenuOpenIndex(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Copy className="h-4 w-4" />
                          Copy API profile id
                        </button>
                        <button
                          onClick={() => {
                            alert(`Disconnected from ${entry.name}`);
                            setMenuOpenIndex(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div> */}

              {/* Profile Image and Information */}
              {/* <div className="flex flex-col gap-2">
                    <img
                      src={entry.image}
                      alt={entry.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <p className="text-lg font-medium text-gray-800">
                      {entry.name}
                    </p>
                  </div> */}

              {/* Post Date */}
              {/* <p className="mt-2 text-xs text-gray-500">{entry.date}</p>
                </div> */}
              {/* ))} */}
            </div>
          </>
        )}
      </div>

      {/* Sheet Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Connect profiles</SheetTitle>
            <SheetDescription>
              Connect social media profiles by clicking below.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 max-h-[calc(100vh-150px)] space-y-3 overflow-y-auto pr-2">
            {socialPlatforms.map((platform, index) => (
              <div
                key={index}
                onClick={platform.onClick}
                className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                  platform.available
                    ? "cursor-pointer bg-white hover:bg-gray-100"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={platform.image}
                    alt={platform.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium text-black">{platform.name}</p>
                    <p className="text-sm text-gray-500">{platform.type}</p>
                  </div>
                </div>
                {platform.available ? (
                  <ArrowRight className="h-5 w-5 text-gray-500" />
                ) : (
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-black">
                    COMING SOON
                  </span>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SocialMediaAccounts;
