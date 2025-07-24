import { TwitterLoginButton } from "react-social-login-buttons";

const Twitter = () => {
  const handleTwitterLogin = () => {
    // Redirect to your backend route that starts Twitter OAuth
    window.location.href = "http://localhost:5000/auth/twitter";
  };

  return (
    <div onClick={handleTwitterLogin} style={{ cursor: "pointer" }}>
      <TwitterLoginButton text="Continue with Twitter" />
    </div>
  );
};

export default Twitter;
