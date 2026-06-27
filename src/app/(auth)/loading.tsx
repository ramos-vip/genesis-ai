import Spinner from "@/components/ui/Spinner";

export default function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size="md" color="accent" />
    </div>
  );
}
