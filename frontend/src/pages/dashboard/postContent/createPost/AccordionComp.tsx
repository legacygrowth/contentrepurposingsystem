import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Image,
  MessageCircle,
  Tag,
  FileText,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import CreatePostForm from "./CreatePostForm";
import { UseFormReturn } from "react-hook-form";
import { FormValues, postButtons, SocialPage } from "./CreatePost";
import Discussion from "./Discussion";
import PostGroup from "./PostGroup";

type AccordionProps = {
  socialPages: SocialPage[];
  form: UseFormReturn<FormValues>;
  onOpenModal: () => void;
  onOpenMediaLibrary: () => void;
  buttons: typeof postButtons;
  selectedPostKey: string;
  onSelectPost: (key: string) => void;
};

const AccordionComp = ({
  form,
  onOpenModal,
  onOpenMediaLibrary,
  buttons,
  selectedPostKey,
  onSelectPost,
  socialPages,
}: AccordionProps) => {
  return (
    <div className="flex-2">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1" className="rounded-none">
          <AccordionTrigger className="cursor-pointer rounded-none border-b px-3 py-2 hover:bg-gray-100 hover:text-inherit hover:[text-decoration:none] [&>*]:no-underline">
            <div className="flex items-center gap-2">
              <Calendar />
              Planning
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <PostGroup form={form} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="rounded-none">
          <AccordionTrigger className="cursor-pointer rounded-none border-b px-3 py-2 hover:bg-gray-100 hover:text-inherit hover:[text-decoration:none] [&>*]:no-underline">
            <div className="flex items-center gap-2">
              <Image />
              Content
            </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-auto px-3 py-2">
            <CreatePostForm
              form={form}
              onOpenModal={onOpenModal}
              onOpenMediaLibrary={onOpenMediaLibrary}
              buttons={buttons}
              selectedPostKey={selectedPostKey}
              onSelectPost={onSelectPost}
              socialPages={socialPages}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="rounded-none">
          <AccordionTrigger className="cursor-pointer rounded-none border-b px-3 py-2 hover:bg-gray-100 hover:text-inherit hover:[text-decoration:none] [&>*]:no-underline">
            <div className="flex items-center gap-2">
              <MessageCircle />
              Discussion
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2">
            <Discussion />
          </AccordionContent>
        </AccordionItem>{" "}
        <AccordionItem value="item-4" className="rounded-none">
          <AccordionTrigger className="cursor-pointer rounded-none border-b px-3 py-2 hover:bg-gray-100 hover:text-inherit hover:[text-decoration:none] [&>*]:no-underline">
            <div className="flex items-center gap-2">
              <Tag />
              Labels
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2"></AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5" className="rounded-none">
          <AccordionTrigger className="cursor-pointer rounded-none border-b px-3 py-2 hover:bg-gray-100 hover:text-inherit hover:[text-decoration:none] [&>*]:no-underline">
            <div className="flex items-center gap-2">
              <FileText />
              Notes
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 py-2"></AccordionContent>
        </AccordionItem>
        {/* Disabled Items (3 to 7) */}
        {[
          { icon: <DollarSign />, label: "Boost budget", value: "item-6" },
          { icon: <CheckCircle />, label: "Post checklist", value: "item-7" },
        ].map(({ icon, label, value }) => (
          <AccordionItem key={value} value={value} className="rounded-none">
            <AccordionTrigger
              className="cursor-not-allowed rounded-none border-b px-3 py-2 opacity-50 hover:bg-gray-100 hover:text-inherit hover:[text-decoration:none] [&>*]:no-underline"
              onClick={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-2">
                {icon}
                {label}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-2" />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AccordionComp;
