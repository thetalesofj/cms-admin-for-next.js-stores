import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: {
    store_id: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.store_id,
    },
  });
  return <div>{store?.name}</div>;
};

export default DashboardPage;
