



import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { solutions } from "@/app/data/Sollution";
import SolutionClient from "./SolutionClient";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const solution = solutions.find((s) => s.slug === params.slug);
  if (!solution) return {};
  return {
    title: `${solution.title} | Solutions`,
    description: solution.summary,
  };
}

function getPrevNext(slug: string) {
  const idx = solutions.findIndex((s) => s.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = solutions[(idx - 1 + solutions.length) % solutions.length];
  const next = solutions[(idx + 1) % solutions.length];
  return { prev, next };
}

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const solution = solutions.find((s) => s.slug === params.slug);
  if (!solution) return notFound();

  const { prev, next } = getPrevNext(solution.slug);
  const related = solutions.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <SolutionClient
      solution={solution}
      prev={prev}
      next={next}
      related={related}
    />
  );
}
