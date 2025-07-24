import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus2,
  RefreshCw,
  CheckCircle,
  XCircle,
  UserMinus2,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { useNavigate } from "react-router-dom";

const Team: React.FC = () => {

const userDetails = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if(!userDetails.token){      
      navigate("/auth/login");
    }
});

  //const location = useLocation();
  const navigate = useNavigate();
  //const { token } = location.state || {};

  const [open, setOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Manager");
  const [invitedRole, setInvitedRole] = useState("Manager"); // For the role in the Invited User Row section
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // Track if Popover is open

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
      setShowCancelModal(false);
    }
  };

  const handleResend = () => {
    setIsRefreshing(true);
    setShowNotification(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowNotification(false);
    }, 1500);
  };

  const handleRoleSelect = (role: string) => {
    setInvitedRole(role); // Set selected role for invited user
    setIsPopoverOpen(false); // Close the Popover
  };

  return (
    <div className="dark:bg-background relative mx-auto mt-10 w-full max-w-7xl rounded-lg border bg-white shadow-md dark:text-white">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 p-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Workspace Members (1)</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage users of this workspace.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Invite Member
        </button>
      </div>

      {/* Logged-in User Section */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 p-6 md:flex-row md:items-center">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-900 text-xl text-white">
            I
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Indigo Gopher{" "}
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-orange-500">
                you
              </span>
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              saadatkhanbuk@gmail.com
            </p>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-400">
          Workspace Owner
        </span>
      </div>

      {/* Invited User Row */}
      <div className="mx-6 mt-6 mb-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:space-x-8">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-900 text-xl text-white">
            S
          </div>
          <div>
            <h3 className="inline-block rounded bg-amber-100 px-5 py-1 text-xs font-medium text-orange-500">
              Invite sent
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              saadatkhanbuk@gmail.com
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button className="w-35" variant="outline">
                {invitedRole}
                <ChevronDown className="ml-6 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div
                className="hover:bg-accent my-2 flex cursor-pointer flex-col py-2"
                onClick={() => handleRoleSelect("Admin")}
              >
                <div className="text-md font-bold">Admin</div>
                <p className="text-sm font-light">
                  Has full access and can perform all actions in the workspace.
                </p>
              </div>
              <div
                className="hover:bg-accent my-2 flex cursor-pointer flex-col py-2"
                onClick={() => handleRoleSelect("Manager")}
              >
                <div className="text-md font-bold">Manager</div>
                <p className="text-sm font-light">
                  Responsible for operations, has full access but cannot manage
                  users nor billing.
                </p>
              </div>
              <div
                className="hover:bg-accent my-2 flex cursor-pointer flex-col py-2"
                onClick={() => handleRoleSelect("Client")}
              >
                <div className="text-md font-bold">Client</div>
                <p className="text-sm font-light">
                  Can only connect socials, approve posts, comment, and view
                  analytics.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Refresh icon */}
          <div className="group relative">
            <button
              onClick={handleResend}
              className={`text-gray-600 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-300 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded border bg-black px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
              Resend Invite
            </div>
          </div>

          {/* Cancel icon with tooltip */}
          <div className="group relative">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-gray-600 transition hover:text-red-600 dark:text-white dark:hover:text-red-500"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded border bg-black px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
              Cancel Invite
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed right-4 bottom-4 z-50 w-[90%] max-w-xs rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-md sm:right-6 sm:bottom-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>User invite sent!</span>
            </div>
            <button onClick={() => setShowNotification(false)}>
              <XCircle className="h-5 w-5 text-green-600 hover:text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Cancel Invite Modal */}
      {showCancelModal && (
        <div
          onClick={closeModal}
          className="bg-opacity-40 absolute inset-0 z-50 flex items-center justify-center px-4"
        >
          <div className="dark:bg-background relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-lg dark:text-white">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex flex-col items-start space-y-2">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <UserMinus2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-left text-xl font-semibold">
                  Cancel Invite
                </h3>
                <p className="mt-1 text-left text-sm text-gray-400">
                  Are you sure you want to cancel this invite? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  alert("Invite cancelled.");
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {open && (
        <div
          onClick={closeModal}
          className="bg-opacity-40 absolute inset-0 z-50 flex items-center justify-center px-4"
        >
          <div className="dark:bg-background relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-lg dark:text-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex flex-col items-start space-y-2">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <UserPlus2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-left text-xl font-semibold">
                  Invite Member
                </h3>
                <p className="mt-1 text-left text-sm text-gray-400">
                  Invite a new member to join this workspace. If user is already
                  registered, they will automatically be added.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="w-full justify-between sm:w-84"
                      variant="outline"
                    >
                      {selectedRole}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[90vw] max-w-sm sm:max-w-md">
                    <div
                      className="hover:bg-accent my-2 flex cursor-pointer flex-col py-2"
                      onClick={() => setSelectedRole("Admin")}
                    >
                      <div className="text-md font-bold">Admin</div>
                      <p className="text-sm font-light">
                        Has full access and can perform all actions in the
                        workspace.
                      </p>
                    </div>
                    <div
                      className="hover:bg-accent my-2 flex cursor-pointer flex-col py-2"
                      onClick={() => setSelectedRole("Manager")}
                    >
                      <div className="text-md font-bold">Manager</div>
                      <p className="text-sm font-light">
                        Responsible for operations, has full access but cannot
                        manage users nor billing.
                      </p>
                    </div>
                    <div
                      className="hover:bg-accent my-2 flex cursor-pointer flex-col py-2"
                      onClick={() => setSelectedRole("Client")}
                    >
                      <div className="text-md font-bold">Client</div>
                      <p className="text-sm font-light">
                        Can only connect socials, approve posts, comment and
                        view analytics.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
