import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE7] text-black font-sans flex flex-col">
      <nav className="sticky top-0 z-50 bg-[#F1EFE7] flex justify-between items-center p-6 md:p-8">
        <h1
          className="text-site-name font-semibold tracking-[0.05em]"
          style={{ fontSize: "1.2em" }}
        >
          The Reiferson Collection
        </h1>

        <div className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-navigation tracking-[0.05em] font-medium hover:opacity-60 opacity-60"
          >
            Work
          </Link>
          <span className="text-navigation tracking-[0.05em] font-medium opacity-80">
            About
          </span>
        </div>

        <button className="md:hidden text-navigation tracking-[0.05em] font-medium">
          Menu
        </button>
      </nav>

      <main className="flex-1 px-4 md:px-32 lg:px-40 max-w-4xl mx-auto py-8">
        <div className="space-y-8 md:space-y-12">
          <h1 className="text-content-title font-semibold tracking-[0.05em]">
            The Reiferson Collection
          </h1>
          <div className="space-y-6 leading-relaxed text-content-copy">
            <p>
              The Reiferson Collection represents one of the most comprehensive
              archives of vintage baseball photography, documenting the
              evolution of America's pastime from the late 19th century through
              the integration era.
            </p>
            <p>
              This collection focuses particularly on the often-overlooked
              stories of the color line in baseball, featuring rare photographs
              and documents that chronicle both the segregation and eventual
              integration of professional baseball.
            </p>
            <p>
              From the pioneering work of photographers like Charles M. Conlon
              to the intimate documentation of Negro League players and the
              historic moments surrounding Jackie Robinson's breakthrough, these
              images preserve crucial moments in both sports and civil rights
              history.
            </p>
            <Link
              href="/"
              className="inline-block text-navigation tracking-[0.05em] font-medium hover:opacity-60 underline"
            >
              ← Back to Collection
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
