import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ModalClient } from "./components/client";
import { ModalColumn } from "./components/columns";

const ModalPage = async ({ params }: { params: { store_id: string } }) => {
  const modals = await prismadb.modal.findMany({
    where: {
      store_id: params.store_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedModals: ModalColumn[] = modals.map((item) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    description: item.description,
    terms_and_conditions: item.terms_and_conditions,
    link: item.link,
    isPublished: item.isPublished,
    isImagePublished: item.isImagePublished,
    createdAt: format(item.createdAt, "do MMMM yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModalClient data={formattedModals} />
      </div>
    </div>
  );
};

export default ModalPage;
