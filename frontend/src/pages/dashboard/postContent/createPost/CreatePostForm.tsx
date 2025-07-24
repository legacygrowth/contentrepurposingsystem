import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { getRequest } from "@/utils/genericapi";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Mic,
  Trash2,
  UploadCloud,
  Send,
  Hash,
  Smile,
  Bot,
  ChevronsUpDown,
  Check,
  X,
  Eye,
  Twitter,
  ArrowRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Emoji } from "@emoji-mart/data";
import { FileText } from "lucide-react";

import ImageInputField from "./ImageInputField";
import { FormValues, postButtons, SocialPage } from "./CreatePost";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type EmojiMartEmoji = {
  native: string;
  id?: string;
  name?: string;
  [key: string]: unknown;
};

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;

// Social platforms data from your first file
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

type Props = {
  form: UseFormReturn<FormValues>;
  onOpenModal: () => void;
  onOpenMediaLibrary: () => void;
  buttons: typeof postButtons;
  selectedPostKey: string;
  onSelectPost: (key: string) => void;
  handlePreviewClick: () => void;
  workspaceId: string;
};

const CreatePostForm = ({
  form,
  onOpenModal,
  onOpenMediaLibrary,
  buttons,
  selectedPostKey,
  onSelectPost,
  handlePreviewClick,
  workspaceId,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false); // State for Sheet modal
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [socialPages, setSocialPages] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState({
    caption: false,
    tags: false,
    transcript: false,
  });
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));

  const togglePage = (value: string) => {
    setSelectedPages((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      form.setValue("social", updated);
      return updated;
    });
  };

  const clearAll = () => {
    setSelectedPages([]);
    form.setValue("social", []);
  };

  const getPlatformIcon = (platform: string): string => {
    const iconMap: Record<string, string> = {
      Facebook: "/icons/facebook.png",
      Instagram: "/icons/instagram.png",
      Twitter: "/icons/twitter.png",
      LinkedIn: "/icons/linkedin.png",
      YouTube: "/icons/youtube.png",
      Pinterest: "/icons/pinterest.png",
      TikTok: "/icons/tiktok.png",
      Snapchat: "/icons/snapchat.png",
    };

    return iconMap[platform] || "/icons/default-social.png";
  };

  type SocialMediaResponse = {
    _id: string;
    platform: string;
    appId: string;
    appSecret: string;
    accessToken: string;
    userAccessToken: string;
    pageId: string;
    profileData: object;
    workSpaceID: string;
    createdAt: string;
    _v: number;
  };

  const fetchSocialProfiles = async () => {
    try {
      // Step 1: First call createsocialmedia (POST)
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "connect.sid=s%3AzZfNB38n2DjoHN2i3jGwIM8fuL7rnd57.%2BBaN59OlmDoaQknj4HfqxCK63KRBwZQ5vEtnWDofuxo",
      );

      const raw = JSON.stringify({
        platform: "Twitter",
        appId: "ui01Tg7jS08Sm2CzpVJrOnzbn",
        appSecret: "4vX7WZQWfd9hk8cl6MkPHddkmqYaCU93j4Yo6teQjY8E9UpSpG",
        accessToken: "1935423609817939970-rPXMCytCxwMoG5axI5NMsIdIBT36MN",
        userAccessToken: "0qC3arOMfcFr3vKHPP5WyohCYj9MEFfriuakKlaNenbR9",
        pageId: "1935423609817939970",
        agencyID: "6853927f32ba76343aca7c4a",
        workSpaceID: "6853927f32ba76343aca7c4c",
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const createRes = await fetch(
        "http://localhost:5000/api/socialmedia/createsocialmedia",
        requestOptions,
      );
      const createdProfile = await createRes.json();
      console.log("Created social media profile:", createdProfile);

      // Step 2: Now fetch all workspace accounts (GET)
      const socialAccounts = await getRequest<SocialMediaResponse[]>(
        `/api/workspaceaccounts/getworkspaceaccounts/${workspaceId}`,
      );

      console.log("Fetched from API:", socialAccounts);

      // Step 3: Transform data
      const transformedPages = socialAccounts.map((account) => ({
        value: account._id,
        name: (account.profileData as any)?.name || account.platform,
        page: account.platform,
        category: (account.profileData as any)?.category || "",
        followers: (account.profileData as any)?.followers || 0,
        image: getPlatformIcon(account.platform),
      }));

      // Step 4: Update UI
      setSocialPages(transformedPages);
    } catch (error) {
      console.error("Failed to fetch social profiles:", error);
      setSocialPages([]);
    }
  };

  // Run when workspaceId changes
  useEffect(() => {
    if (workspaceId) fetchSocialProfiles();
  }, [workspaceId]);

  useEffect(() => {
    form.setValue("social", selectedPages);
  }, [selectedPages]);

  // Replace your useEffect for visualization with this:
  useEffect(() => {
    let animationId: number | null = null;

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size to match its display size
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      const analyser = analyserRef.current;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3b82f6";
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    if (isRecording) {
      animationId = requestAnimationFrame(draw);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRecording]);

  // console.log("socialPages:", socialPages);

  const startSpeechRecognition = () => {
    // @ts-ignore
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition");
      return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        }
      }
      form.setValue("prompt", form.getValues("prompt") + finalTranscript);
    };
    (recognition as any).onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const removeDoubleQuotes = (text: string): string => {
    return text.replace(/^"|"$/g, "");
  };

  const callOpenAI = async (type: "caption" | "tags") => {
    const inputText = form.getValues("prompt") || "";

    if (!inputText.trim() && !audioFile) {
      alert("Please provide text or upload a voice note to generate content.");
      return;
    }

    const prompt =
      type === "caption"
        ? `Write a creative and engaging caption`
        : `Generate 5 relevant hashtags without numbering`;

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
        }),
      });

      const data = await res.json();
      let result = data.choices[0].message.content.trim();
      result = removeDoubleQuotes(result);

      if (type === "caption") {
        form.setValue("prompt", result);
      } else {
        const hashtagLines = result
          .split("\n")
          .filter((line: string) => line.startsWith("#"))
          .slice(0, 5)
          .join(" ");

        form.setValue("prompt", `${form.getValues("prompt")} ${hashtagLines}`);
      }
    } catch (error) {
      console.error("OpenAI error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // New function to handle voice transcription
  const generateTranscript = async () => {
    const currentAudioFile = audioFile;

    if (!currentAudioFile) {
      alert("Please upload or record a voice note first.");
      return;
    }

    setLoading((prev) => ({ ...prev, transcript: true }));

    try {
      const formData = new FormData();
      formData.append("file", currentAudioFile);
      formData.append("model", "whisper-1");

      console.log(
        "Sending audio file for transcription:",
        currentAudioFile.name,
        currentAudioFile.size,
      );

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const transcript = data.text;

      // Append the transcript to the existing prompt text
      const currentPrompt = form.getValues("prompt") || "";
      const newPrompt = currentPrompt
        ? `${currentPrompt}\n\n${transcript}`
        : transcript;
      form.setValue("prompt", newPrompt);

      console.log("Transcript generated:", transcript);
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Failed to generate transcript. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, transcript: false }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "audio/mpeg" ||
        file.name.endsWith(".mp3") ||
        file.type === "audio/webm" ||
        file.type === "audio/wav")
    ) {
      setAudioFile(file);
      setAudioSrc(URL.createObjectURL(file));
    } else {
      alert("Please select a valid audio file (MP3, WebM, or WAV)");
    }
  };

  const handleDeleteAudio = () => {
    // Clean up old object URL to prevent memory leaks
    if (audioSrc) {
      URL.revokeObjectURL(audioSrc);
    }

    setAudioFile(null);
    setAudioSrc(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const startRecording = async () => {
    // Clear any previous recording data
    setRecordedChunks([]);
    setShowDialog(true);
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      source.connect(analyser);

      // Initialize fresh chunks array
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          // Update state immediately
          setRecordedChunks((prevChunks) => [...prevChunks, e.data]);
        }
      };

      mediaRecorder.onstop = () => {
        // Use the chunks from closure, not state
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `recording_${Date.now()}.webm`, {
          type: "audio/webm",
        });

        // Update audio file state
        setAudioFile(file);
        setAudioSrc(URL.createObjectURL(file));
      };

      mediaRecorder.start(100); // Collect data every 100ms
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone.");
      setIsRecording(false);
      setShowDialog(false);
    }
  };

  const finishRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      (mediaRecorder.stream.getTracks() as MediaStreamTrack[]).forEach(
        (track) => track.stop(),
      );
    }

    // Create blob from recorded chunks
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    const file = new File([blob], `recording_${Date.now()}.webm`, {
      type: "audio/webm",
    });

    // Update state with new file
    setAudioFile(file);
    setAudioSrc(URL.createObjectURL(file));
    setIsRecording(false);
    setShowDialog(false);

    // Clear recorded chunks for next recording
    setRecordedChunks([]);

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const stopOngoingRecordingOnly = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      (mediaRecorder.stream.getTracks() as MediaStreamTrack[]).forEach(
        (track) => track.stop(),
      );
    }
    setIsRecording(false);
    setIsPaused(false);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const toggleRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    } else {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlatformConnection = (platform: any) => {
    // Create a new social page entry
    const newSocialPage = {
      value: `${platform.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`, // unique ID
      name: platform.name,
      page: platform.name,
      category: platform.type,
      followers: 0,
      image: platform.image,
    };

    // Add to socialPages state
    setSocialPages((prev) => [...prev, newSocialPage]);

    // Optionally auto-select the newly added platform
    setSelectedPages((prev) => [...prev, newSocialPage.value]);

    // Close the sheet
    setSheetOpen(false);

    console.log(`Connected to ${platform.name}`);
  };

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col justify-between gap-12">
          <div>
            {/* Social Pages Selection */}
            <FormField
              control={form.control}
              name="social"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          role="combobox"
                          variant={"outline"}
                          className="relative w-full justify-between border bg-[var(--base-color)] text-[var(--contrast-color)] shadow-none"
                        >
                          {selectedPages.length > 0
                            ? `${selectedPages.length} page(s) selected`
                            : `Select social profiles (${socialPages.length})`}
                          <ChevronsUpDown className="absolute right-2 h-4 w-4 shrink-0" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search page..."
                            className="h-9"
                          />
                          <CommandList>
                            {socialPages.length === 0 ? (
                              // <CommandEmpty>No page found.</CommandEmpty>
                              <span>twitter</span>
                            ) : (
                              <CommandGroup>
                                {socialPages.map((page) => (
                                  <CommandItem
                                    key={page.value}
                                    onSelect={() => togglePage(page.value)}
                                  >
                                    <div className="flex w-full items-center gap-3">
                                      {page.icon ? (
                                        page.icon
                                      ) : page.image ? (
                                        <img
                                          src={page.image}
                                          alt={page.name}
                                          className="h-8 w-8 rounded-full"
                                        />
                                      ) : (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                          <span className="text-xs font-medium">
                                            {page.name.charAt(0)}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex flex-col text-left">
                                        <span className="font-medium">
                                          {page.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                          {page.page}{" "}
                                          {page.category &&
                                            `• ${page.category}`}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                          Followers:{" "}
                                          {page.followers.toLocaleString()}
                                        </span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          selectedPages.includes(page.value)
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                            <Button
                              type="button"
                              onClick={() => setSheetOpen(true)}
                              className="mt-2 w-full"
                            >
                              + Add
                            </Button>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Selected Pages Chips */}
            {selectedPages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPages.map((val) => {
                  const page = socialPages.find((p) => p.value === val);
                  return (
                    <div
                      key={val}
                      className="bg-muted flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                    >
                      {page?.icon ? (
                        <div className="h-5 w-5">{page.icon}</div>
                      ) : page?.image ? (
                        <img
                          src={page.image}
                          alt={page.name}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                          <span className="text-xs">
                            {page?.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span>{page?.name}</span>
                      <button
                        type="button"
                        onClick={() => togglePage(val)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-2 hover:bg-gray-100"
                  onClick={clearAll}
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </div>

          {/* Prompt Field - Only One Section! */}
          <div>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="relative w-full">
                    <FormLabel>Prompt: </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type/Record/Upload your prompt here..."
                        className="min-h-[120px] resize-none pr-24 pb-10 break-words !text-black"
                        {...field}
                      />
                    </FormControl>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".mp3,.webm,.wav,audio/mpeg,audio/webm,audio/wav"
                      className="hidden"
                    />
                    {/* Top Buttons */}
                    <div className="absolute top-[-40px] left-0 flex w-full gap-2">
                      {buttons.map((btn) => (
                        <Button
                          type="button"
                          key={btn.key}
                          onClick={() => onSelectPost(btn.key)}
                          className={`text-white ${
                            selectedPostKey === btn.key
                              ? "ring-2 ring-black"
                              : ""
                          }`}
                          style={{ backgroundColor: btn.color }}
                        >
                          {btn.icon}
                        </Button>
                      ))}
                    </div>
                    {/* Bottom Buttons */}
                    <div className="absolute bottom-2 left-2 flex gap-2">
                      <div className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-2 hover:bg-gray-100"
                          onClick={() => setShowEmojiPicker((prev) => !prev)}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                        {showEmojiPicker && (
                          <div
                            ref={emojiPickerRef}
                            className="absolute bottom-10 left-0 z-50"
                          >
                            <Picker
                              data={data}
                              onEmojiSelect={(emoji: EmojiMartEmoji) =>
                                field.onChange(field.value + emoji.native)
                              }
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-2 hover:bg-gray-100"
                        onClick={() => callOpenAI("caption")}
                      >
                        {loading.caption ? "..." : <Bot className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-2 hover:bg-gray-100"
                        onClick={() => callOpenAI("tags")}
                      >
                        {loading.tags ? "..." : <Hash className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="absolute right-2 bottom-2 flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-2 hover:bg-gray-100"
                        onClick={startRecording}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-2 hover:bg-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud />
                      </Button>
                      {audioFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-2 hover:bg-gray-100"
                          onClick={handleDeleteAudio}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Audio Player with Transcript Button */}
            {audioFile && (
              <div className="mt-2 flex items-center">
                <audio
                  ref={audioRef}
                  src={audioSrc || ""}
                  className="custom-audio flex-1"
                  controls
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 bg-black p-2 text-white hover:bg-white hover:text-black"
                  onClick={generateTranscript}
                  disabled={loading.transcript}
                  title="Generate Transcript"
                >
                  {loading.transcript ? (
                    "..."
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-2 hover:bg-gray-100"
                  onClick={handleDeleteAudio}
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </div>

          {/* Image Input */}
          <ImageInputField
            form={form}
            onOpenMediaLibrary={onOpenMediaLibrary}
          />
        </form>
      </Form>

      {/* Recording Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open && isRecording) {
            stopOngoingRecordingOnly();
          }
          setShowDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recording...</DialogTitle>
            <DialogDescription>
              Speak now. Your voice is being recorded.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 w-full">
            <canvas
              ref={canvasRef}
              className="h-32 w-full rounded-lg bg-gray-100"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={toggleRecording}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="default" onClick={finishRecording}>
              Finish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sheet Drawer for Adding Social Platforms */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                  platform.available
                    ? "cursor-pointer bg-white hover:bg-gray-100"
                    : "bg-gray-50"
                }`}
                onClick={() => {
                  if (platform.available) {
                    handlePlatformConnection(platform);
                  }
                }}
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

export default CreatePostForm;
