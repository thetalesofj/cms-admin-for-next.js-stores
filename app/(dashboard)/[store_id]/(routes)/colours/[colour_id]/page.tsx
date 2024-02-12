import prismadb from "@/lib/prismadb";
import ColourFrom from "./components/colour-form";

const ColourPage = async ({ params }: { params: { colour_id: string } }) => {
  const colour = await prismadb.colour.findUnique({
    where: {
      id: params.colour_id,
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
