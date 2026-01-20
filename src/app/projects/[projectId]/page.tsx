const Page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  return <div className="">project {projectId}</div>;
};

export default Page;
