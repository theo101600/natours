import axios from "axios";

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    "pk_test_51SVBVYBSWc98WbqkdeQiAMauZh1XVuoefgVYsv2XvJoAfguM0DSSLiErDrd6T0YqiDeoEqNcK9JxeWM98RoFkpsv00zD3Jngsx",
  );
  try {
    //1 Get the session from the API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //2 Create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
