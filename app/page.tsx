import ExplanationPanel from "@/components/ExplanationPanel";
import GraphCanvas from "@/components/GraphCanvas";
import InputPanel from "@/components/InputPanel";
import SimulationLegend from "@/components/SimulationLegend";
import StepExplanation from "@/components/StepExplanation";
import StepProgressBar from "@/components/StepProgressBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6">
        <ExplanationPanel />

        <section className="grid gap-4 sm:gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,860px)_280px] xl:justify-center">
          <div className="h-fit">
            <InputPanel />
          </div>

          <div className="w-full xl:mx-auto">
            <GraphCanvas />
          </div>

          <div className="h-fit lg:col-span-2 xl:col-span-1">
            <SimulationLegend />
          </div>
        </section>

        <section className="flex flex-col gap-4 sm:gap-5">
          <StepExplanation />
          <StepProgressBar />
        </section>
      </main>
    </div>
  );
}
