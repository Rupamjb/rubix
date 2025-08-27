import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl">
      <nav className="glass flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
          <span className="sr-only">CubeAI</span>
        </Link>

        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li><Link href="/" className="transition-colors hover:text-black/70">Home</Link></li>
          <li><Link href="/solve" className="transition-colors hover:text-black/70">Solve</Link></li>
          <li><Link href="/patterns" className="transition-colors hover:text-black/70">Patterns</Link></li>
          <li><Link href="/learn" className="transition-colors hover:text-black/70">Learn</Link></li>
          <li><Link href="/about" className="transition-colors hover:text-black/70">About</Link></li>
        </ul>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm transition-colors hover:text-black/70">Sign In</Link>
          {/* lightswind button substitute (glass) */}
          <Link href="/solve" className="glass px-4 py-2 text-sm hover-force">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
