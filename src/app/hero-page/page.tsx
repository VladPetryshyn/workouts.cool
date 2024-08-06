import "./hero-page.scss";
import { OutlinedButton } from "@/components/buttons/outlined";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="hero-page-content">
      <main className="hero-section">
        <div className="hero-section-text">
          <h1 className="displayFontH2">
            time to change yourself. the clock is ticking!
          </h1>
          <p>Start changing you're body with our articles, and workouts</p>
        </div>
        <OutlinedButton
          text="Start the change"
          className="call-to-action-btn"
        />
      </main>
      <section className="testimonials">
        <h1 className="displayFontH2">billions of people trust us</h1>
        <div className="testimonials-content">
          <div className="testimonial">
            <div className="testimonial-img">
              <img src="/hero-page/testimonials/1.webp" alt="" />
            </div>
            <div className="testimonial-content">
              <h3 className="testimonial-content-header">Epifaniy Kukuev</h3>
              <p className="testimonial-content-p">
                Before finding this app, I was just a small skinny guy, but
                after...
              </p>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-img">
              <img src="/hero-page/testimonials/1.webp" alt="" />
            </div>
            <div className="testimonial-content">
              <h3 className="testimonial-content-header">Epifaniy Kukuev</h3>
              <p className="testimonial-content-p">
                Before finding this app, I was just a small skinny guy, but
                after...
              </p>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-img">
              <img src="/hero-page/testimonials/1.webp" alt="" />
            </div>
            <div className="testimonial-content">
              <h3 className="testimonial-content-header">Epifaniy Kukuev</h3>
              <p className="testimonial-content-p">
                Before finding this app, I was just a small skinny guy, but
                after...
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="join-community">
        <Image
          src="/hero-page/join-now.svg"
          alt="globe icon"
          width={200}
          height={200}
          className="globe"
        />
        <h1 className="displayFontH2">Join the world wide community!</h1>
        <OutlinedButton text="join now" />
      </section>
    </div>
  );
}
