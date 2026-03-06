export default function ExplanationPanel() {
  return (
    <section className="mx-auto w-full max-w-5xl rounded-xl border border-slate-700/70 bg-slate-900 p-6 text-slate-100 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight">
        How Encrypted Computation Works
      </h2>

      <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
        <p>
          Encrypted Compute Explorer demonstrates how privacy-preserving
          computation works using secret sharing.
        </p>
        <p>
          Instead of sending raw data to a single server, the value is split
          into several secret shares. Each node receives only one fragment of
          the data. No node can see the complete value.
        </p>
        <p>
          The nodes then cooperate to perform computation on these fragments.
          The original value is never revealed during the process.
        </p>
        <p>Only the final result is reconstructed from the shares.</p>
      </div>
    </section>
  );
}
