import { useLocation } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const { token } = location.state || {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
        <p className="text-gray-600">This is where payment form will go.</p>

        {token && <p className="mt-2 text-sm text-green-600">Token: {token}</p>}
      </div>
    </div>
  );
}
