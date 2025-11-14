export async function initiatePayment(cartItems: any[]) {
  // Stub: replace with Stripe integration later.
  console.log("initiatePayment called with:", cartItems);
  return Promise.resolve({ ok: true, sessionId: "stub-session" });
}
