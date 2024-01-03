import prismadb from "@/lib/prismadb";
import ColourFrom from "./components/colourForm";

const ColourPage = async ({ params }: { params: { colourId: string } }) => {
  const colour = await prismadb.colour.findUnique({
    where: {
      id: params.colourId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColourFrom initialData={colour} />
      </div>
    </div>
  );
};

export default ColourPage;
