import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { useNavigate } from "react-router-dom";

const invoices = [
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
  { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
  { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
  { invoice: "INV007", paymentStatus: "Unpaid", totalAmount: "$300.00", paymentMethod: "Credit Card" },
];

export function Apikey() {

 const userDetails = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if(!userDetails.token){      
      navigate("/auth/login");
    }
});

  //const location = useLocation();
  const navigate = useNavigate();
  //const { token } = location.state || {};

  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isAllSelected = selectedInvoices.length === invoices.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map((inv) => inv.invoice));
    }
  };

  const toggleSelectOne = (invoice: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoice)
        ? prev.filter((i) => i !== invoice)
        : [...prev, invoice]
    );
  };

  return (
    <div className="px-6">
      <Table className="border">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow className="text-xl font-bold">
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              /> 
            </TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm text-gray-500">
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedInvoices.includes(invoice.invoice)}
                  onChange={() => toggleSelectOne(invoice.invoice)}
                />
              </TableCell>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>   
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 text-sm text-blue-500"
                        onClick={() => setSheetOpen(true)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 text-sm text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-gray-500">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Sheet for Edit */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Invoice</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">This is where your form fields would go.</p>
            {/* Example placeholder input */}
            <input
              type="text"
              placeholder="Invoice Title"
              className="w-full px-3 py-2 border rounded-md dark:text-primary"
            />
            <Button className="w-full">Save Changes</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
