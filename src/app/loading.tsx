import Spinner from "@/components/ui/Spinner";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
          <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-white" aria-hidden>
            <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor" />
          </svg>
        </div>
        <Spinner size="sm" color="default" label="Loading…" />
      </div>
    </div>
  );
}
