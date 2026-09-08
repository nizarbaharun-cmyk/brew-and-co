import { Hero } from "./components/hero";
import { PopularSection } from "./components/popular-section";
import { EventsSection } from "./components/events-section";
import { ReservationSection } from "./components/reservation-section";
import { ReviewsSection } from "./components/reviews-section";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularSection />
      <EventsSection />
      <ReservationSection />
      <ReviewsSection />
    </>
  );
}
