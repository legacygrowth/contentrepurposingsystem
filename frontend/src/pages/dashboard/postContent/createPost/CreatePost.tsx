import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet";
import SheetSidebar from "@/pages/dashboard/postContent/createPost/sheet/SheetSidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import SplitSection from "@/components/dashboard/splitSection/SplitSection";
import { Card } from "@/components/ui/card";
import {
  ArrowUp,
  Copy,
  Download,
  Link2Off,
  Trash2,
  UserCheck,
  UserMinusIcon,
  Users,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AccordionComp from "./AccordionComp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import GeneralPost from "./socialMediaUI/GeneralPost";
import FB from "./socialMediaUI/FB";
import Insta from "./socialMediaUI/InstaPost";
import TwitterPost from "./socialMediaUI/Twitter";
import { FaRegFileAlt } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import LinkedIn from "./socialMediaUI/LinkedIn";
import Pinterest from "./socialMediaUI/Pinterest";
import { apiService } from "@/utils/api";

export const formSchema = z.object({
  social: z.array(z.string()).optional(),
  prompt: z.string().min(1, "Content is required"),
  images: z.array(z.instanceof(File)).optional(),
  postStatus: z.enum(["draft", "now", "scheduleForLater"]),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  twitterAltText: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const postButtons = [
  {
    key: "general",
    name: "General Post",
    icon: <FaRegFileAlt />,
    color: "#3b82f6",
    status: true,
    condition: () => true,
  },
  {
    key: "facebook",
    name: "Facebook Post",
    icon: <FaFacebookF />,
    color: "#1877F2",
    status: false,
    condition: () => true,
  },
  {
    key: "instagram",
    name: "Instagram Post",
    icon: <FaInstagram />,
    color: "#E4405F",
    status: false,
    condition: () => true,
  },
  {
    key: "twitter",
    name: "Twitter Post",
    icon: <FaTwitter />,
    color: "#000",
    status: false,
    condition: () => true,
  },
  {
    key: "linkedin",
    name: "LinkedIn Post",
    icon: <FaLinkedinIn />,
    color: "#0077b5",
    status: false,
    condition: () => true,
  },
  {
    key: "pinterest",
    name: "Pinterest Post",
    icon: <FaPinterestP />,
    color: "#e60023",
    status: false,
    condition: () => true,
  },
];

export type SocialPage = {
  image: string;
  name: string;
  page: string;
  value: string;
  id: string;
};

const socialPages: SocialPage[] = [
  {
    image: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
    name: "Facebook Page",
    page: "facebook.com/yourpage",
    value: "facebook",
    id: "6853f9d7a3e764da2ed5e1e8",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/733/733558.png",
    name: "Instagram Page",
    page: "instagram.com/yourpage",
    value: "instagram",
    id: "7853f9d7a3e764da2ed5e1e9",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
    name: "Twitter Page",
    page: "twitter.com/yourpage",
    value: "twitter",
    id: "1935423609817939970",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/145/145807.png",
    name: "LinkedIn Page",
    page: "linkedin.com/company/yourpage",
    value: "linkedin",
    id: "9853f9d7a3e764da2ed5e1f1",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/145/145808.png",
    name: "Pinterest Page",
    page: "pinterest.com/yourpage",
    value: "pinterest",
    id: "a853f9d7a3e764da2ed5e1f2",
  },
];

const CreatePost = () => {
  const [openAccordianSheet, setOpenAccordianSheet] = useState(false);
  const [openMediaLibrary, setOpenMediaLibrary] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [userPosts, setUserPosts] = useState([{}]);
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Excited for the cricket action this...",
      image: "/dashboard/createPosts/cricket.png",
    },
    {
      id: 2,
      title: "Thinking about making a change? Let's kick...",
      image: "/dashboard/createPosts/smoking.png",
    },
    {
      id: 3,
      title: "Another post about cricket",
      image: "/dashboard/createPosts/cricket.png",
    },
    {
      id: 4,
      title: "Another post about no smoking",
      image: "/dashboard/createPosts/smoking.png",
    },
  ]);

  const now = new Date();

  const userDetails = useSelector((state: RootState) => state.user);

  function formatTimeTo12Hour(date: Date) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      social: ["twitter"],
      prompt: "",
      images: undefined,
      postStatus: "now",
      twitterAltText: "",
    },
  });

  form.watch("prompt");
  const socials = form.watch("social") || [];

  const facebook = socials.find((page) => page == "facebook");
  const facebookDetails = socialPages.find((page) => page.value == facebook);

  const insta = socials.find((page) => page == "instagram");
  const instaDetails = socialPages.find((page) => page.value == insta);

  const twitter = socials.find((page) => page == "twitter");
  const twitterDetails = socialPages.find((page) => page.value == twitter);

  const linkedIn = socials.find((page) => page == "linkedin");
  const linkedInDetails = socialPages.find((page) => page.value == linkedIn);

  const pinterest = socials.find((page) => page == "pinterest");
  const pinterestDetails = socialPages.find((page) => page.value == pinterest);

  const [selectedPostKey, setSelectedPostKey] = useState("facebook");

  const visibleButtons = postButtons.filter((btn) => btn.condition(socials));

  useEffect(() => {
    if (
      visibleButtons.length > 0 &&
      !visibleButtons.some((btn) => btn.key === selectedPostKey)
    ) {
      setSelectedPostKey("general");
    }
  }, [visibleButtons]);

  // Check if screen is mobile/tablet
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const parseTimeString = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

  // CreatePost.tsx
  // Replace your existing onSubmit function in CreatePost.tsx with this:

  const onSubmit = async (data: FormValues) => {
    if (!userDetails.token || !userDetails.twitterAccessToken) {
      setApiError("User not authenticated or Twitter not connected");
      return;
    }
    console.log("Userdetails:", userDetails);

    setIsLoading(true);
    setApiError("");

    try {
      const formData = new FormData();

      // Append post content
      formData.append("text", data.prompt);
      formData.append("labels", "");
      formData.append("notes", "");
      formData.append("boostBudget", "0");

      // Append images if any
      if (data.images && data.images.length > 0) {
        data.images.forEach((file: File) => {
          formData.append("media", file);
        });
      }

      // Build query parameters for Twitter credentials (this is what the backend expects)
      const queryParams = new URLSearchParams({
        oauth_token: userDetails.twitterAccessToken,
        oauth_token_secret: userDetails.twitterAccessTokenSecret || "",
        userId: userDetails.twitterUserId || "",
        workspaceId: userDetails.workspaceId || "",
      });

      // Make API call to backend with query parameters
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/twitter/post-with-media?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            // Don't set Content-Type for FormData, let the browser set it
            Authorization: `Bearer ${userDetails.token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Twitter post");
      }

      const result = await response.json();
      console.log("Twitter post created:", result);
      alert("Post created successfully on Twitter!");

      // Reset form
      form.reset({
        ...form.getValues(),
        prompt: "",
        images: [],
        twitterAltText: "",
      });
      setOpenAccordianSheet(false);
    } catch (error) {
      console.error("Error creating Twitter post:", error);
      setApiError(`Failed to create post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const [modalContent, setModalContent] = useState<
    "client" | "internal" | null
  >(null);
  const closeModal = () => setOpenModal(false);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Render preview content
  const renderPreviewContent = () => {
    if (selectedPostKey === "general") {
      return (
        <GeneralPost
          prompt={form.getValues("prompt")}
          uploadedImages={form.getValues("images") || []}
        />
      );
    }
    if (selectedPostKey === "facebook") {
      return (
        <FB
          social={facebookDetails}
          prompt={form.getValues("prompt")}
          images={form.getValues("images") || []}
        />
      );
    }
    if (selectedPostKey === "instagram") {
      return (
        <Insta
          social={instaDetails}
          prompt={form.getValues("prompt")}
          images={form.getValues("images") || []}
        />
      );
    }
    if (selectedPostKey === "twitter") {
      return (
        <TwitterPost
          social={twitterDetails}
          prompt={form.getValues("prompt")}
          images={form.getValues("images") || []}
          altText={form.getValues("twitterAltText")}
        />
      );
    }
    if (selectedPostKey === "linkedin") {
      return (
        <LinkedIn
          social={linkedInDetails}
          prompt={form.getValues("prompt")}
          images={form.getValues("images") || []}
        />
      );
    }
    if (selectedPostKey === "pinterest") {
      return (
        <Pinterest
          social={pinterestDetails}
          prompt={form.getValues("prompt")}
          images={form.getValues("images") || []}
        />
      );
    }
    return null;
  };

  return (
    <>
      {userPosts && userPosts.length > 0 ? (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:mb-6">
            <input
              type="text"
              placeholder={`Search (${filteredPosts.length})`}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-1/3 sm:px-4 sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center justify-between text-xs text-gray-500 sm:justify-end sm:text-sm">
              <span>0 - 3 of 3</span>
              <div className="ml-2">
                <button className="rounded px-2 py-1 hover:bg-gray-200">
                  &#8592;
                </button>
                <button className="ml-1 rounded px-2 py-1 hover:bg-gray-200">
                  &#8594;
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {/* Create Post Button - Always First */}
            <div className="flex h-[150px] items-center justify-center rounded-lg bg-white shadow-sm sm:h-[180px] lg:h-[200px]">
              <Button
                onClick={() => setOpenAccordianSheet(true)}
                className="h-full w-full flex-col gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-transparent text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800"
                variant="outline"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl">+</div>
                <span className="text-xs font-medium sm:text-sm">
                  Create Post
                </span>
              </Button>
            </div>

            {/* Existing Posts */}
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="relative h-[150px] overflow-hidden rounded-lg bg-white shadow-sm sm:h-[180px] lg:h-[200px]"
              >
                {/* Social Media Account Header */}
                <div className="flex h-6 items-center justify-between border-b border-gray-100 bg-gray-50 px-2 py-1 sm:h-8">
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 flex-shrink-0 rounded-full bg-gray-300 sm:h-5 sm:w-5">
                        <img
                          src="https://via.placeholder.com/20x20/3b82f6/ffffff?text=U"
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <span className="truncate text-xs font-medium text-gray-700">
                        @username
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <FaFacebookF className="h-2.5 w-2.5 text-blue-600 sm:h-3 sm:w-3" />
                    </div>
                  </div>
                </div>

                {/* Post Title */}
                <div className="flex h-8 items-center justify-between p-2 sm:h-10">
                  <div className="line-clamp-2 flex-1 pr-2 text-xs font-medium text-gray-800">
                    {post.title}
                  </div>
                  <div>
                    <button className="flex-shrink-0 text-lg leading-none text-gray-500 hover:text-gray-700 sm:text-xl">
                      ...
                    </button>
                  </div>
                </div>

                {/* Post Image */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-[calc(150px-24px-32px)] w-full object-cover sm:h-[calc(180px-32px-40px)] lg:h-[calc(200px-32px-40px)]"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 sm:p-6">
          <SplitSection
            imageSrc="/dashboard/createPosts/createpost.avif"
            title="Create your post"
            description="Quickly craft, customize, and schedule your post for any platform."
            features={[
              "Add captions, media, and hashtags",
              "Choose target platforms for posting",
              "Preview how your post will look",
            ]}
            buttonText="Start Creating"
            onButtonClick={() => setOpenAccordianSheet(true)}
          />
        </div>
      )}

      {/* SHEET - RESPONSIVE LAYOUT */}
      <Sheet open={openAccordianSheet} onOpenChange={setOpenAccordianSheet}>
        <SheetContent
          side="left"
          className="flex h-full w-full flex-col gap-0 p-0 sm:w-[95%] md:w-[90%] lg:w-[85%] [&>button.absolute.right-4.top-4]:hidden"
        >
          {/* Fixed Header */}
          <SheetHeader className="flex shrink-0 flex-row items-center justify-between border-b bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold sm:text-xl">Create Post</h2>

              {/* View Button for Mobile */}
              {isMobile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 hover:bg-gray-100"
                  onClick={() => setOpenPreviewModal(true)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Preview
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-2 hover:bg-gray-100"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-2 hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-2 hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-2 hover:bg-gray-100"
                onClick={() => setOpenAccordianSheet(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Scrollable Content Area */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left Sidebar - Responsive Width */}
            <div
              className={`flex shrink-0 flex-col border-r border-gray-200 bg-white ${
                isMobile || !previewVisible
                  ? "w-full"
                  : "w-full sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[400px]"
              }`}
            >
              <div className="flex-1 overflow-y-auto">
                <AccordionComp
                  form={form}
                  onOpenModal={() => setOpenModal(true)}
                  onOpenMediaLibrary={() => setOpenMediaLibrary(true)}
                  buttons={visibleButtons}
                  selectedPostKey={selectedPostKey}
                  onSelectPost={setSelectedPostKey}
                  socialPages={socialPages}
                />
              </div>

              {/* Twitter-specific alt text field */}
              {selectedPostKey === "twitter" && (
                <div className="shrink-0 border-t bg-white p-3 sm:p-4">
                  <Label htmlFor="twitterAltText" className="text-sm">
                    Alt Text for Image
                  </Label>
                  <Input
                    id="twitterAltText"
                    {...form.register("twitterAltText")}
                    placeholder="Describe the image for accessibility"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Required for better accessibility on Twitter
                  </p>
                </div>
              )}
            </div>

            {/* Right Content Area - Desktop Only */}
            {!isMobile && previewVisible && (
              <Card className="flex min-h-0 flex-1 flex-col rounded-none shadow-none">
                <div className="flex-1 overflow-y-auto px-3 sm:px-4">
                  {renderPreviewContent()}
                </div>
              </Card>
            )}
          </div>

          {/* Fixed Footer */}
          <SheetFooter className="flex shrink-0 flex-col items-stretch justify-end gap-2 border-t bg-white p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-4">
            {apiError && (
              <p className="text-sm text-red-500 sm:mr-4">{apiError}</p>
            )}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-center sm:w-auto"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Ask For Approval
                    <ArrowUp className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal(true);
                        setModalContent("client");
                      }}
                      className="flex w-full items-center gap-2 rounded px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      <UserMinusIcon className="h-4 w-4" />
                      Client approval
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal(true);
                        setModalContent("internal");
                      }}
                      className="flex w-full items-center gap-2 rounded px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      <Users className="h-4 w-4" />
                      Internal approval
                    </button>
                    <span
                      className="flex cursor-not-allowed items-center gap-2 rounded px-4 py-2 text-sm text-gray-400 select-none"
                      aria-disabled="true"
                    >
                      <Link2Off className="h-4 w-4" />
                      Share Public Link
                    </span>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenAccordianSheet(false)}
                  className="flex-1 sm:flex-none"
                >
                  Close
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  {isLoading ? "Creating..." : "Save"}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Preview Modal for Mobile/Tablet */}
      <Dialog open={openPreviewModal} onOpenChange={setOpenPreviewModal}>
        <DialogContent className="h-[90vh] max-h-[90vh] w-full max-w-[95vw] p-0">
          <DialogTitle className="border-b bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Post Preview</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenPreviewModal(false)}
                className="h-8 w-8 p-2"
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </div>
          </DialogTitle>
          <div className="flex-1 overflow-y-auto p-4">
            {renderPreviewContent()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Library Sheet */}
      <Sheet open={openMediaLibrary} onOpenChange={setOpenMediaLibrary}>
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col gap-0 p-0 sm:w-[95%] md:w-[90%] lg:w-[85%] [&>button.absolute.right-4.top-4]:hidden"
        >
          <div className="flex-1 overflow-y-auto">
            <SheetSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={openModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold">
            {modalContent === "client"
              ? "Client approval request"
              : "Internal approval request"}
          </DialogTitle>
          <div className="mt-2 space-y-4">
            <div>
              <label className="block text-sm font-medium">Recipients</label>
              <input
                type="text"
                placeholder="Select recipients (0)"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <span className="text-muted-foreground mt-1 inline-block text-xs">
                Invite
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium">Subject</label>
              <input
                type="text"
                defaultValue="Post for your approval"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <span className="text-muted-foreground mt-1 inline-block text-xs">
                Customise
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium">Text</label>
              <textarea
                rows={5}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                defaultValue={`Dear ${modalContent === "client" ? "client" : "team"},

I've sent you a post for your approval.
Could you please approve or deny the changes?

Best regards.`}
              />
              <span className="text-muted-foreground mt-1 inline-block text-xs">
                Customise
              </span>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={closeModal} variant="ghost">
              Close
            </Button>
            <Button>Send for approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
