"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { StyleEditModal } from "@/components/modals/style-edit-modal";
import { StyleDeleteModal } from "@/components/modals/style-delete-modal";
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

interface StyleFormProps {
  initialData: Style[] | null;
  categories: Category[];
  subcategories: SubCategory[]
}

const formSchema = z.object({
  name: z.string().array().optional(),
  subcategory_id: z.string().min(1),
  category_id: z.string().min(1),
});

type StyleFormValues = z.infer<typeof formSchema> ;

const StyleForm: React.FC<StyleFormProps> = ({
  initialData,
  categories,
  subcategories
}) => {
  
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [styles, setStyles] = useState<{ name: string }[]>(initialData ?? []);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(-1);
  const [selectedStyleName, setSelectedStyleName] = useState("");

  const title = initialData ? "Edit Style" : "Create Style";
  const description = initialData ? "Edit a Style" : "Add a New Style";
  const toastSubMessage = initialData ? "Style Updated!" : "Style Created!";
  const action = initialData ? "Save Changes" : "Create";
  
  const form = useForm<StyleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      name: "",
      category_id: "",
      subcategory_id: "",
    },
  });

  const openEditModal = (name: string) => {
    setSelectedStyleName(name);
    setEditModalOpen(true);
  };

  const openDeleteModal = (index: number, name: string) => {
    setSelectedStyleIndex(index);
    setSelectedStyleName(name);
    setDeleteModalOpen(true);
  };
  
  const addStyle = () => {
    const styleValue = form.getValues("name");
    if (styleValue) {
      setStyles((prev) => [...prev, { name: styleValue }]);
      form.setValue("name", "");
    }
  };

  const onSubmit = async (data: StyleFormValues) => {
    const { name, ...formData } = data;
    const productData = {
      ...formData,
      store_id: params.store_id,
      styles: styles.map((styles) => styles.name)
    };
    try {
      console.log(productData)
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.store_id}/styles/${params.style_id}`,
          productData
        );
      } else {
        await axios.post(`/api/${params.store_id}/styles`, productData);
      }
      router.refresh();
      router.push(`/${params.store_id}/styles`);
      toast.success(toastSubMessage);
    } catch (error) {
        console.error("API Error:", error);
        const errorMessage = error?.response?.data?.error ?? "Something Went Wrong";
        toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.store_id}/styles/${params.style_id}`
      );
      router.refresh();
      router.push(`/${params.store_id}/styles`);
      toast.success("Styles Deleted.");
    } catch (error) {
      toast.error(
        "Make Sure You Have Removed All Products Using This Styles First."
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
      <StyleEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={(editedStyle) => {
          const updatedStyles = [...styles];
          updatedStyles[selectedStyleIndex] = { name: editedStyle };
          setStyles(updatedStyles);
          setEditModalOpen(false);
        }}
        loading={false}
        style={selectedStyleName}
      />
      <StyleDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          const updatedStyles = styles.filter((_, index) => index !== selectedStyleIndex);
          setStyles(updatedStyles);
          setDeleteModalOpen(false);
        }}
        loading={false}
        style={selectedStyleName}
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
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category</FormLabel>
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
                          placeholder="Select a sub-category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
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
                  <FormLabel>Style Name(s)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Input
                        disabled={loading}
                        placeholder="E.g. Trainers"
                        {...field}
                        value={field.value ?? ''}
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
              A list of styles for the correlating category and sub-category
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Styles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((styles, index) => (
                <TableRow key={index}>
                  <TableCell>{styles.name}</TableCell>
                  <TableCell className="space-x-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => openEditModal(styles.name)}
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => openDeleteModal(index, styles.name)}
                      disabled={loading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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

export default StyleForm;
