import Hero from "../components/Hero";
import GlassCard from "../components/Glasscard";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Features (reference-style three columns) */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-24">
        <GlassCard title="📸 Scan Your Cube" className="hover-force">
          Upload photos of all 6 sides; CV maps colors & validates the cube. Our computer vision system ensures accurate color detection.
        </GlassCard>
        <GlassCard title="🧩 Step-by-Step Solving" className="hover-force">
          Animated moves with reasoning; see which pieces move and why. Perfect for learning advanced techniques.
        </GlassCard>
        <GlassCard title="🎨 Pattern Mode" className="hover-force">
          Pick checkerboard, cube-in-cube, or design your own and get steps. Create beautiful patterns effortlessly.
        </GlassCard>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-8" data-aos="fade-up">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard className="hover-force" data-aos="fade-right">
            <h3 className="text-xl font-bold mb-4">1. Upload Your Cube</h3>
            <p className="text-gray-700 mb-4">Take clear photos of all six sides of your cube. Our AI will analyze the colors and validate the cube state.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Supports any standard 3x3 cube</li>
              <li>Works in various lighting conditions</li>
              <li>Instant color recognition</li>
            </ul>
          </GlassCard>
          <GlassCard className="hover-force" data-aos="fade-left">
            <h3 className="text-xl font-bold mb-4">2. Get Your Solution</h3>
            <p className="text-gray-700 mb-4">Watch the 3D visualization guide you through each move. Understanding the solution is key to improving.</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Clear move notation</li>
              <li>Explained reasoning</li>
              <li>Practice mode available</li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-8" data-aos="fade-up">Why Choose CubeAI</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard className="hover-force" data-aos="fade-up" data-aos-delay="0">
            <h3 className="text-xl font-bold mb-2">🎯 Precision</h3>
            <p className="text-gray-700">Advanced computer vision ensures accurate color detection and state validation.</p>
          </GlassCard>
          <GlassCard className="hover-force" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-xl font-bold mb-2">🎓 Learning</h3>
            <p className="text-gray-700">Detailed explanations help you understand why each move matters.</p>
          </GlassCard>
          <GlassCard className="hover-force" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-xl font-bold mb-2">🎨 Creative</h3>
            <p className="text-gray-700">Create and solve beautiful patterns with our pattern generator.</p>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <GlassCard className="text-center py-12 hover-force" data-aos="zoom-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Solve Your Cube?</h2>
          <p className="text-gray-700 mb-6">Join thousands of users who've mastered their Rubik's Cube with CubeAI.</p>
          <a href="/solve" className="glass px-6 py-3 text-lg hover-force inline-block">
            Start Solving Now
          </a>
        </GlassCard>
      </section>
    </>
  );
}
