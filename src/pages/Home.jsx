import { useEffect } from "react";
import HomeImagePreloader from "../components/HomeImagePreloader";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import Products from "../components/Products";
import OtherServices from "../components/OtherServices";
// import OurTeam from "../components/OurTeam";
import Careers from "../components/Careers";
import Footer from "../components/Footer";
import "../styles/homeImmersive.css";

function useImmersiveHomeScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("is-immersive-home");

    const panels = Array.from(document.querySelectorAll(
      ".home-hero-layer, .home-content-layer > .home-section"
    ));

    panels.forEach((panel) => panel.classList.add("home-immersive-panel"));

    if (typeof IntersectionObserver === "undefined") {
      panels.forEach((panel) => panel.classList.add("is-visible"));
      return () => {
        root.classList.remove("is-immersive-home");
        panels.forEach((panel) => {
          panel.classList.remove("home-immersive-panel", "is-visible");
        });
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.48,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    panels.forEach((panel) => observer.observe(panel));

    return () => {
      observer.disconnect();
      root.classList.remove("is-immersive-home");
      panels.forEach((panel) => {
        panel.classList.remove("home-immersive-panel", "is-visible");
      });
    };
  }, []);
}

export default function Home({ onContact }) {
  useImmersiveHomeScroll();

  return (
    <>
      <HomeImagePreloader />
      <div className="home-pinned-layout">
        <div className="home-hero-layer">
          <Hero onContact={onContact} />
        </div>
        <main className="home-content-layer">
          <section className="home-section home-combined-panel home-stats-services-panel">
            <Stats />
            <Services />
          </section>
          <Products onContact={onContact} />
          <OtherServices onContact={onContact} />
          {/* <OurTeam /> */}
          <section className="home-section home-combined-panel home-careers-footer-panel">
            <Careers />
            <Footer />
          </section>
        </main>
      </div>
    </>
  );
}
