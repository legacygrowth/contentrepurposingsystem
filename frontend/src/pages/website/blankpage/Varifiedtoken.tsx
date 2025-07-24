import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/AppStore";
import { getRequest } from "@/utils/genericapi";

interface VerifySuccessResponse {
  message: string;
  userType: string;
  email: string;
  token: string;
  firstName: string;
  lastName: string;
  agencyName: string;
  workspaceName: string;
  agencyId: string;
  workspaceId: string;
  isPaymentVerified: boolean;
  userId: string;
}

type UserDataResponse = {
  data: {
    message: string;
    userType: string;
    email: string;
    token: string;
    firstName: string;
    lastName: string;
    agencyName: string;
    workspaceName: string;
    agencyId: string;
    workspaceId: string;
    isPaymentVerified: boolean;
    userId: string;
  };
};

const VerifiedToken: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tokenParam = useMemo(() => {
    return new URLSearchParams(location.search).get("token");
  }, [location.search]);

  const { data, error, isLoading } = useQuery<UserDataResponse, Error>({
    queryKey: ["verifyToken", tokenParam],
    enabled: !!tokenParam,
    queryFn: async () => {
      if (!tokenParam) throw new Error("Token not found.");
      return await getRequest<UserDataResponse>(
        `/api/tempuser/getUser?token=${tokenParam}`,
      );
    },
    retry: false,
  });

  useEffect(() => {
    if (data?.data) {
      const userData = data.data;
      dispatch(
        setUser({
          token: userData.token,
          userId: userData.userId,
          email: userData.email,
          agencyName: userData.agencyName,
          workspaceName: userData.workspaceName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          agencyId: userData.agencyId,
          workspaceId: userData.workspaceId,
        }),
      );

      if (userData.userType === "New user") {
        navigate("/onboarding/flow");
      } else if (
        userData.userType === "Existing user" &&
        !userData.isPaymentVerified
      ) {
        navigate("/onboarding/choose-plan");
      } else if (
        userData.userType === "Existing user" &&
        userData.isPaymentVerified
      ) {
        navigate("/dashboard");
      } else {
        navigate("/auth/login");
      }
    }
    if (error) {
      alert("Invalid or expired token");
      navigate("/");
    }
  }, [data, error, navigate, dispatch]);

  return <div>{isLoading && <p>Verifying...</p>}</div>;
};

export default VerifiedToken;
