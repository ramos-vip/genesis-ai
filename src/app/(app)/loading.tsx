import Spinner from "@/components/ui/Spinner";

export default function AppLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" color="accent" label="Loading…" />
    </div>
  );
}
