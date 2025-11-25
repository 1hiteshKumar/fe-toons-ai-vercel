import Dashboard from "@/components/pages/studio/dashboard";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex h-screen w-full">
      <Dashboard taskId={id} />
    </div>
  );
}
