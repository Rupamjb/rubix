import GlassCard from "../components/Glasscard";

export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">
      <h1 className="text-4xl font-extrabold mb-6">About CubeAI</h1>
      
      {/* Main Description */}
      <GlassCard className="hover-force mb-12">
        <p className="text-gray-700 mb-6">
          CubeAI scans your cube, validates the state, and generates a human-friendly,
          reasoned solution with an animated 3D preview. Pattern mode lets you
          recreate designs step-by-step. Privacy-first: images are processed ephemerally.
        </p>
        <div className="flex gap-4">
          <a href="/solve" className="glass px-4 py-2 hover-force">Try It Now</a>
          <a href="/learn" className="glass px-4 py-2 hover-force">Learn More</a>
        </div>
      </GlassCard>

      {/* Technology Stack */}
      <h2 className="text-2xl font-bold mb-6">Our Technology</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <GlassCard className="hover-force" title="Computer Vision">
          <p className="text-gray-700">
            Advanced image processing algorithms detect and map cube colors accurately
            across various lighting conditions. Our validation system ensures the
            cube state is physically possible before solving.
          </p>
        </GlassCard>
        <GlassCard className="hover-force" title="Solving Engine">
          <p className="text-gray-700">
            Our solver optimizes for both move count and human understanding.
            Solutions are explained step-by-step with clear reasoning and
            visualizations to help you learn as you solve.
          </p>
        </GlassCard>
      </div>

      {/* Features */}
      <h2 className="text-2xl font-bold mb-6">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <GlassCard className="hover-force" title="🔒 Privacy First">
          <p className="text-gray-700">Your cube photos are processed locally and never stored.</p>
        </GlassCard>
        <GlassCard className="hover-force" title="💡 Smart Solutions">
          <p className="text-gray-700">Adaptive solving methods based on your skill level.</p>
        </GlassCard>
        <GlassCard className="hover-force" title="🎨 Pattern Creation">
          <p className="text-gray-700">Design and achieve beautiful cube patterns easily.</p>
        </GlassCard>
      </div>

      {/* Contact */}
      <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
      <GlassCard className="hover-force text-center py-8">
        <h3 className="text-xl font-bold mb-4">Questions or Feedback?</h3>
        <p className="text-gray-700 mb-6">
          We'd love to hear from you! Reach out with questions, suggestions, or just to say hello.
        </p>
        <a href="mailto:contact@cubeai.com" className="glass px-4 py-2 hover-force inline-block">
          Contact Us
        </a>
      </GlassCard>
    </section>
  );
}
