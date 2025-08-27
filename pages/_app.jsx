import { useEffect, useRef } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps, router }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Lenis (smooth scrolling)
    (async () => {
      const { default: Lenis } = await import("@studio-freight/lenis");
      lenisRef.current = new Lenis({ smoothWheel: true, lerp: 0.1 });
      const raf = (time) => { lenisRef.current?.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    })();

    // AOS (scroll animations)
    (async () => {
      const AOS = (await import("aos")).default;
      await import("aos/dist/aos.css");
      AOS.init({ duration: 700, easing: "ease-out-quart", once: true });
    })();

    // Barba.js page transitions (basic fade)
    (async () => {
      if (typeof window === "undefined") return;
      const barba = (await import("@barba/core")).default;

      // Prevent double init in HMR
      if (barba?.initialized) return;
      try {
        barba.init({
          transitions: [{
            name: "fade",
            async leave({ current }) {
              await new Promise((r) => {
                current.container.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }).addEventListener("finish", r);
              });
            },
            enter({ next }) {
              next.container.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: "forwards" });
            }
          }]
        });
        barba.initialized = true;
      } catch (e) {
        // Barba can be finicky in SPA frameworks; fail silently if needed.
        console.warn("Barba init skipped:", e?.message);
      }
    })();

    return () => { lenisRef.current?.destroy?.(); };
  }, []);

  // Fake barba containers around route changes (Next replaces DOM; barba watches data attributes)
  useEffect(() => {
    document.body.setAttribute("data-barba", "wrapper");
    const mount = document.getElementById("__next");
    mount?.setAttribute("data-barba", "container");
    mount?.setAttribute("data-barba-namespace", router.pathname.replace("/", "") || "home");
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>CubeAI — Rubik’s Cube Solver</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* lightswind UI: if you have its CSS/JS, import here */}
      </Head>
      <Navbar />
      <main className="min-h-screen">{<Component {...pageProps} key={router.route} />}</main>
      <Footer />
    </>
  );
}
