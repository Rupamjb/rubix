import GlassCard from "../components/Glasscard";

export default function Learn() {
  const guides = [
    { t: "Beginner Method", d: "Layer-by-layer approach, gentle learning curve.", steps: ["White Cross", "First Layer Corners", "Middle Layer Edges", "Yellow Face", "Final Layer"] },
    { t: "CFOP Overview", d: "Cross, F2L, OLL, PLL — speedsolving standard.", steps: ["Cross Building", "F2L Pairs", "OLL Recognition", "PLL Execution"] },
    { t: "OLL & PLL Cases", d: "Full algorithms with visual mnemonics.", steps: ["2-Look OLL", "Full OLL", "2-Look PLL", "Full PLL"] }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">
      <h1 className="text-4xl font-extrabold mb-6">Learn to Solve</h1>
      <p className="text-gray-700 mb-12 max-w-2xl">Master the Rubik's cube with our comprehensive guides. From beginner-friendly methods to advanced speedsolving techniques, we've got you covered.</p>

      {/* Main Learning Paths */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {guides.map((g) => (
          <GlassCard key={g.t} className="hover-force" title={g.t}>
            <p className="text-gray-700 mb-4">{g.d}</p>
            <ul className="text-sm space-y-2 text-gray-600">
              {g.steps.map((step, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20"></span>
                  {step}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      {/* Additional Resources */}
      <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <GlassCard className="hover-force" title="Interactive Trainer">
          <p className="text-gray-700 mb-4">Practice algorithms with our 3D cube simulator. Get instant feedback and track your progress.</p>
          <a href="#" className="glass px-4 py-2 inline-block hover-force">Start Training</a>
        </GlassCard>
        <GlassCard className="hover-force" title="Algorithm Database">
          <p className="text-gray-700 mb-4">Browse our comprehensive collection of algorithms. Filter by case, length, and popularity.</p>
          <a href="#" className="glass px-4 py-2 inline-block hover-force">Browse Algorithms</a>
        </GlassCard>
      </div>

      {/* Quick Tips */}
      <h2 className="text-2xl font-bold mb-6">Quick Tips</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="hover-force" title="🎯 Recognition">
          <p className="text-gray-700">Learn pattern recognition techniques to quickly identify cases and choose algorithms.</p>
        </GlassCard>
        <GlassCard className="hover-force" title="⚡ Finger Tricks">
          <p className="text-gray-700">Master essential finger tricks to execute algorithms faster and more efficiently.</p>
        </GlassCard>
        <GlassCard className="hover-force" title="📊 Progress">
          <p className="text-gray-700">Track your solving times and algorithm recognition speed with our tools.</p>
        </GlassCard>
      </div>
    </section>
  );
}
