import type { Metadata } from "next";

import { Nav } from "@/components/landing/Nav";
import { absoluteUrl } from "@/lib/site";

const description =
  "Explore research and perspectives on AI, trading, and trust in the Conduence reading library.";

export const metadata: Metadata = {
  title: "Docs",
  description,
  alternates: {
    canonical: absoluteUrl("/docs"),
  },
  openGraph: {
    title: "Docs | CONDUENCE",
    description,
    url: absoluteUrl("/docs"),
  },
};

const articles = [
  {
    publisher: "OKX Learn",
    title:
      "We Asked 1,400 Crypto Traders If They’d Let AI Run Their Portfolios. Most Said Yes.",
    description:
      "A survey of 1,400 U.S. crypto traders explores how much control they would give AI and what it would take to build trust.",
    href: "https://www.okx.com/en-us/learn/insights006",
    background: "bg-[#d7f0f8]",
  },
  {
    publisher: "Anjali Jha · Medium",
    title: "Insight or Trap",
    description: "Read Anjali Jha’s article on Medium.",
    href: "https://medium.com/@anjalijha2k3/insight-or-trap-5ccf134ccc52",
    background: "bg-[#F5F4F1]",
  },
] as const;

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white text-[#140206]">
        <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-32 md:pt-40 lg:px-8">
          <div className="mb-10 max-w-2xl md:mb-14">
            <p className="m-0 mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#626262] [font-family:var(--font-ui),system-ui,sans-serif]">
              Research &amp; perspectives
            </p>
            <h1 className="m-0 text-5xl font-normal leading-none tracking-[-0.03em] md:text-7xl">
              Docs
            </h1>
            <p className="m-0 mt-5 max-w-xl text-lg leading-relaxed text-[#626262] md:text-xl">
              A reading library on AI, trading, and the trust that connects them.
            </p>
          </div>

          <section aria-labelledby="articles-heading">
            <h2
              id="articles-heading"
              className="m-0 mb-5 text-xs font-medium uppercase tracking-[0.12em] [font-family:var(--font-ui),system-ui,sans-serif]"
            >
              Featured reading
            </h2>
            <div className="grid gap-7 md:grid-cols-2 md:gap-8">
              {articles.map((article) => (
                <a
                  key={article.href}
                  href={article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col border-[2.5px] border-[#140206] bg-white p-4 text-inherit no-underline shadow-[5px_5px_0_0_#140206] transition-shadow hover:shadow-[8px_8px_0_0_#140206] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#140206] motion-reduce:transition-none"
                >
                  <div className={`flex flex-1 flex-col p-5 md:p-6 ${article.background}`}>
                    <p className="m-0 mb-5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#515151] [font-family:var(--font-ui),system-ui,sans-serif]">
                      {article.publisher}
                    </p>
                    <h3 className="m-0 text-[1.65rem] font-normal leading-tight tracking-[-0.025em] md:text-[1.85rem]">
                      {article.title}
                    </h3>
                    <p className="m-0 mt-5 text-sm leading-relaxed text-[#515151] [font-family:var(--font-ui),system-ui,sans-serif]">
                      {article.description}
                    </p>
                  </div>
                  <span className="mt-4 flex items-center justify-between gap-3 px-2 py-2 text-xs font-medium uppercase tracking-[0.1em] [font-family:var(--font-ui),system-ui,sans-serif]">
                    Read article
                    <span className="sr-only"> (opens in a new tab)</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 19 19 5M5 5h14v14" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
