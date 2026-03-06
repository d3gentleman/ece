const legendItems = [
  {
    name: "INPUT",
    colorClass: "bg-slate-500",
    description: "waiting for private input",
  },
  {
    name: "SPLIT",
    colorClass: "bg-purple-500",
    description: "the secret value is divided into multiple shares",
  },
  {
    name: "DISTRIBUTE",
    colorClass: "bg-blue-500",
    description: "shares are sent to distributed nodes",
  },
  {
    name: "COMPUTE",
    colorClass: "bg-orange-500",
    description:
      "nodes compute using the shares without reconstructing the original value",
  },
  {
    name: "RECONSTRUCT",
    colorClass: "bg-green-500",
    description: "shares combine to reveal the final result",
  },
];

export default function SimulationLegend() {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Simulation Legend</h2>

      <div className="mt-3 space-y-3">
        {legendItems.map((item) => (
          <div
            key={item.name}
            className="flex items-start gap-3 rounded-md border border-slate-100 p-3"
          >
            <span
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-sm ${item.colorClass}`}
              aria-hidden="true"
            />
            <div>
              <div className="text-sm font-semibold text-slate-900">{item.name}</div>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
