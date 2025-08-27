import GlassCard from "./Glasscard";

export default function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-28 pb-16">
      <div className="grid lg:grid-cols-[1fr,520px] gap-10 items-center">
        <div>
          <p className="text-sm text-gray-700 mb-4" data-aos="fade-right">
            Upload your cube faces or pick a pattern. Get AI-powered steps with reasoning.
          </p>
          <h1 className="headline" data-aos="fade-right" data-aos-delay="50">
            SOLVE YOUR CUBE •<br /> STEP BY STEP
          </h1>
          <div className="mt-8 max-w-md" data-aos="fade-right" data-aos-delay="100">
            <GlassCard className="hover-force">
              <p className="mb-4 text-gray-800">
                Start by uploading 6 photos (U, R, F, D, L, B). We’ll validate colors and build the cube state.
              </p>
              <a href="/solve" className="glass px-4 py-2 inline-block hover-force">Upload Cube Faces</a>
            </GlassCard>
          </div>
        </div>

        <div className="glass h-[520px] hover-force" data-aos="zoom-in">
          <iframe
            src="https://my.spline.design/practicing-GP8sjBtaooSj4XK7Wh6eokDI/"
            frameBorder="0"
            width="100%"
            height="100%"
            loading="lazy"
            title="Spline 3D Cube"
          />
        </div>
      </div>
    </section>
  );
}
