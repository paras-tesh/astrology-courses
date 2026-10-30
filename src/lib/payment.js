// Demo implementation: pretends the payment succeeded.
//
// For Zarinpal, send { amount, courseIds } to your own server. The server asks
// Zarinpal for a payment authority and answers with { redirectUrl }; the cart
// page then sends the customer there. Zarinpal expects rials unless the
// request sets currency to IRT. Verify the result on the server after the
// customer comes back, and only then unlock the courses.
export async function startPayment({ amount, courseIds }) {
  return { amount, courseIds, paid: true }
}
