
import { LoginSocialLinkedin } from "reactjs-social-login";
import { LinkedInLoginButton } from "react-social-login-buttons";

const LinkedIn = () => {
  return (
    <>
      <LoginSocialLinkedin
        client_id="YOUR_LINKEDIN_CLIENT_ID"
        client_secret="YOUR_LINKEDIN_CLIENT_SECRET" // Only needed for backend exchange, not required on frontend
        redirect_uri={window.location.href}
        onResolve={(response: any) => {
          console.log(response);
        }}
        onReject={(error: any) => {
          console.log(error);
        }}
      >
        <LinkedInLoginButton />
      </LoginSocialLinkedin>
    </>
  );
};

export default LinkedIn;
