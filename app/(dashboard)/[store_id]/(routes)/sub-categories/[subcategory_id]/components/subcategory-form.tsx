"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { StyleModal } from "@/components/modals/style-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubCategory, Category, Style } from "@prisma/client";
import axios from "axios";
import { Plus, SquarePen, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

interface SubCategoryFormProps {
  initialData: SubCategory | null;
  categories: Category[];
  styles: Style[] | undefined
}

const formSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().min(1),
  style: z.string(),
});

type SubCategoryFormValues = z.infer<typeof formSchema> ;

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  initialData,
  categories,
  styles
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStyle, setSaveStyle] = useState<{ name: string }[]>([]);
  const [styleModalOpen, setStyleModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const title = initialData ? "Edit Sub-Category" : "Create Sub-Category";
  const description = initialData ? "Edit a Sub-Category" : "Add a New Sub-Category";
  const toastSubMessage = initialData ? "Sub-Category Updated!" : "Sub-Category Created!";
  const action = initialData ? "Save Changes" : "Create";
  
  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      name: "",
      category_id: "",
      style: "",
    },
  });

  const openStyleModal = () => {
    setStyleModalOpen(true);
  };

  const openAlertModal = () => {
    setAlertModalOpen(true);
  };
  
  const addStyle = () => {
    const styleValue = form.getValues("style");
    if (styleValue) {
      setSaveStyle((prev) => [...prev, { name: styleValue }]);
      form.setValue("style", "");
    }
  };

  const removeStyle = (index: number) => {
    setSaveStyle((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SubCategoryFormValues) => {
    const styles = saveStyle.map((styles) => styles.name);
    const { style, ...formData } = data;
    const productData = {
      ...formData,
      store_id: params.store_id,
      styles
    };
    try {
      console.log(productData)
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.store_id}/sub-categories/${params.subcategory_id}`,
          productData
        );
      } else {
        await axios.post(`/api/${params.store_id}/sub-categories`, productData);
      }
      router.refresh();
      router.push(`/${params.store_id}/sub-categories`);
      toast.success(toastSubMessage);
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        console.error("API Error Response:", error.response.data);
      }
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.store_id}/sub-categories/${params.subcategory_id}`
      );
      router.refresh();
      router.push(`/${params.store_id}/sub-categories`);
      toast.success("Sub-Category Deleted.");
    } catch (error) {
      toast.error(
        "Make Sure You Have Removed All Styles Using This Sub-Category First."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E.g. Shoes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style Name(s)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Input
                        disabled={loading}
                        placeholder="E.g. Trainers"
                        {...field}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={addStyle}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Table>
            <TableCaption>
              A list of styles for the correlating sub-category
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Styles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles && styles.map((styles, index) => (
                <TableRow key={index}>
                  <TableCell>{styles.name}</TableCell>
                  <TableCell className="space-x-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={openStyleModal}
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={openAlertModal}
                      disabled={loading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
              <StyleModal
                isOpen={styleModalOpen}
                onClose={() => setStyleModalOpen(false)}
                onSave={(values) => {
                  console.log("Saving style with values:", values);
                  setStyleModalOpen(false); 
                }}
              />
              <AlertModal
                isOpen={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                onConfirm={() => {
                  console.log("Deleting style...");
                  removeStyle;
                  setAlertModalOpen(false);
                }}
                loading={loading}
              />
          </Table>
          <Separator />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SubCategoryForm;
