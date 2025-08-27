export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/30">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-700">
        © {new Date().getFullYear()} CubeAI — All rights reserved.
      </div>
    </footer>
  );
}
