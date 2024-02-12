import prismadb from "@/lib/prismadb";
import ModalForm from "./components/modal-form";

const ModalPage = async ({ params }: { params: { modal_id: string } }) => {
  const modal = await prismadb.modal.findUnique({
    where: {
      id: params.modal_id,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModalForm initialData={modal} />
      </div>
    </div>
  );
};

export default ModalPage;
