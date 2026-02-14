import { Suspense } from "react";
import Header from "./../components/layout/Header";
import Footer from "./../components/layout/Footer";
import OrderConfirmationClient from "./OrderConfirmationClient";

export default function OrderConfirmationPage() {
  return (
    <>
      <Header />

      <Suspense fallback={<Loading />}>
        <OrderConfirmationClient />
      </Suspense>

      <Footer />
    </>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
    </div>
  );
}
