import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col items-start gap-4">
        <h1 className="text-3xl/12">Recent Quotations</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              className="h-75 w-125 shrink-0 bg-text/20"
              key={`card-${index}${1}`}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-4 pb-2">
        <h1 className="text-3xl/12">Recent Invoices</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              className="h-75 w-125 shrink-0 bg-text/20"
              key={`card-${index}${1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
