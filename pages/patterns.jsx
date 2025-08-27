import GlassCard from "../components/Glasscard";

const patterns = [
  {
    name: "Checkerboard",
    description: "Classic alternating pattern of colors",
    difficulty: "Easy",
    moves: 14
  },
  {
    name: "Plus Sign",
    description: "Creates plus signs on all faces",
    difficulty: "Medium",
    moves: 16
  },
  {
    name: "Cube-in-Cube",
    description: "Smaller cube pattern within each face",
    difficulty: "Hard",
    moves: 20
  },
  {
    name: "Anaconda",
    description: "Snake-like pattern wrapping around the cube",
    difficulty: "Expert",
    moves: 24
  },
  {
    name: "Cross Edges",
    description: "Crosses formed by edge pieces",
    difficulty: "Medium",
    moves: 18
  },
  {
    name: "Six Spots",
    description: "Unique spot pattern on each face",
    difficulty: "Hard",
    moves: 22
  }
];

export default function Patterns() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">
      <h1 className="text-4xl font-extrabold mb-6">Cube Patterns</h1>
      <p className="text-gray-700 mb-10 max-w-2xl">
        Transform your solved cube into beautiful patterns. Choose from our preset collection
        or create your own unique designs. We'll generate the optimal sequence of moves.
      </p>

      {/* Featured Patterns */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {patterns.map((p) => (
          <GlassCard key={p.name} className="cursor-pointer hover-force" title={p.name}>
            <div className="h-32 bg-white/30 rounded-lg border border-white/40 flex items-center justify-center mb-4">
              (Pattern preview)
            </div>
            <p className="text-gray-700 mb-3">{p.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Difficulty: {p.difficulty}</span>
              <span>{p.moves} moves</span>
            </div>
            <a href="/solve" className="glass px-3 py-2 hover-force inline-block">Generate Steps</a>
          </GlassCard>
        ))}
      </div>

      {/* Custom Pattern Creator */}
      <h2 className="text-2xl font-bold mb-6">Create Your Own Pattern</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <GlassCard className="hover-force" title="Pattern Designer">
          <p className="text-gray-700 mb-4">
            Use our interactive 3D designer to create your own patterns.
            Click faces to change colors and preview your design.
          </p>
          <a href="#" className="glass px-4 py-2 hover-force inline-block">Open Designer</a>
        </GlassCard>
        <GlassCard className="hover-force" title="Pattern Library">
          <p className="text-gray-700 mb-4">
            Browse our collection of user-created patterns.
            Save your favorites and share your own designs.
          </p>
          <a href="#" className="glass px-4 py-2 hover-force inline-block">Browse Library</a>
        </GlassCard>
      </div>

      {/* Tips Section */}
      <h2 className="text-2xl font-bold mb-6">Pattern Tips</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="hover-force" title="🎯 Start Simple">
          <p className="text-gray-700">Begin with basic patterns like checkerboard to understand pattern creation principles.</p>
        </GlassCard>
        <GlassCard className="hover-force" title="💡 Save Progress">
          <p className="text-gray-700">Bookmark your favorite patterns and track which ones you've mastered.</p>
        </GlassCard>
        <GlassCard className="hover-force" title="🔄 Practice Moves">
          <p className="text-gray-700">Use our 3D visualizer to practice the move sequences for each pattern.</p>
        </GlassCard>
      </div>
    </section>
  );

}

