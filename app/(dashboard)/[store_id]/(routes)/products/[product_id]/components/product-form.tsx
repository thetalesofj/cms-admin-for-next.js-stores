"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/imageUpload";
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
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, SubCategory, Colour, Image, Product, Size, Brand } from "@prisma/client";
import axios from "axios";
import { Plus, SquarePen, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        style: string[];
      })
    | null;
  categories: Category[];
  colours: Colour[];
  sizes: Size[];
  brands: Brand[];
  subcategories: SubCategory[];
  styles: string[];
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  discount_rate: z.coerce.number().optional(),
  quantity: z.coerce.number(),
  size_id: z.string().optional(),
  category_id: z.string().min(1),
  subcategory_id: z.string().min(1),
  style: z.array(z.string().min(1)),
  colour_id: z.string().min(1),
  brand_id: z.string().min(1),
  is_featured: z.boolean().default(false).optional(),
  is_archived: z.boolean().default(false).optional(),
  is_discounted: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema> & {
  sizeQuantities: { size_id: string; quantity: number }[];
};

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  subcategories,
  colours,
  sizes,
  styles,
  brands,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialData?.style || []);
  
  const [sizeQuantities, setSizeQuantities] = useState<{ size_id: string; quantity: number }[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [quantityInput, setQuantityInput] = useState(0);
  const [editIndex, setEditIndex] = useState<number | null>(null);


  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product" : "Add a New Product";
  const toastMessage = initialData ? "Product Updated!" : "Product Created!";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData.price)),
          discount_rate: parseFloat(String(initialData.discount_rate)),
          quantity: parseFloat(String(initialData.quantity)),
          style: initialData.style ? initialData.style : [],
        }
      : {
          name: "",
          images: [],
          price: 0,
          discount_rate: 0,
          quantity: 0,
          size_id: "",
          category_id: "",
          subcategory_id: "",
          style: [],
          colour_id: "",
          brand_id: "",
          is_featured: false,
          is_archived: false,
          is_discounted: false,
        },
  });

  const addOrUpdateSizeQuantity = () => {
    form.handleSubmit((data) => {
      const { size_id, quantity } = data;
  
      if (editIndex !== null) {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[editIndex] = { size_id, quantity };
        setSizeQuantities(updatedSizeQuantities);
        setEditIndex(null);
      } else {
        const isDuplicate = sizeQuantities.some((sq) => sq.size_id === size_id);
        if (isDuplicate) {
          toast.error('Size already exists');
          return;
        }
        setSizeQuantities((prev) => [...prev, { size_id, quantity }]);
      }
      
      form.setValue("size_id", "");
      form.setValue("quantity", 0);
    })();
  };
  
  const openEditSizeModal = (index: number) => {
    const sizeQuantity = sizeQuantities[index];
    form.setValue("size_id", sizeQuantity.size_id);
    form.setValue("quantity", sizeQuantity.quantity);
    setEditIndex(index);
  };
  
  const openDeleteSizeModal = (index: number) => {
    const updatedSizeQuantities = sizeQuantities.filter((_, i) => i !== index);
    setSizeQuantities(updatedSizeQuantities);
  }; 

  const addStyle = (style: string) => {
    if (!selectedStyles.includes(style)) {
      setSelectedStyles([...selectedStyles, style]);
      form.setValue("style", [...selectedStyles, style]);
    }
  };
  
  const removeStyle = (style: string) => {
    const updatedStyles = selectedStyles.filter(s => s !== style);
    setSelectedStyles(updatedStyles);
    form.setValue("style", updatedStyles);
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const productData = {
        ...data,
        sizeQuantities: sizeQuantities,
      };
      console.log(productData);
      if (initialData) {
        await axios.patch(
          `/api/${params.store_id}/products/${params.product_id}`,
          productData
        );
      } else {
        await axios.post(`/api/${params.store_id}/products`, productData);
      }
      router.refresh();
      router.push(`/${params.store_id}/products`);
      toast.success(toastMessage);
    } catch (error) {
      console.error("API Error:", error);
      toast.error('Something went wrong');
      console.log("Error onSubmit: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.store_id}/products/${params.product_id}`);
      router.refresh();
      router.push(`/${params.store_id}/products`);
      toast.success("Product Deleted.");
    } catch (error: any) {
      toast.error("Something Went Wrong");
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Discount (%)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          placeholder="Select a Category"
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
                          placeholder="Select a Sub-Category"
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
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style(s)</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={addStyle}
                    value=""
                    defaultValue=""
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select Style(s)"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {styles.map((style, index) => (
                        <SelectItem key={index} value={style}>
                          {style}
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
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
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
                          placeholder="Select a Brand"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
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
              name="colour_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colour</FormLabel>
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
                          placeholder="Select a Colour"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colours.map((colour) => (
                        <SelectItem key={colour.id} value={colour.id}>
                          {colour.name}
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
              name="is_discounted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Discounted</FormLabel>
                    <FormDescription>
                      This product will be discounted
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the Home Page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_archived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear in the Store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="size_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
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
                            placeholder="Select a Size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" size="sm" onClick={addOrUpdateSizeQuantity}>
                <Plus className="mr-2 h-4 w-4" />
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </div>
            <Table>
              <TableCaption>A list of sizes and Inventory Available for the correlating category and sub-category</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Sizes</TableHead>
                  <TableHead>Inventory Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeQuantities.map((sq, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {sizes.find((size) => size.id === sq.size_id)?.name}
                    </TableCell>
                    <TableCell>{sq.quantity}</TableCell>
                    <TableCell className="space-x-4">
                      <Button variant="secondary" size="sm" type="button" onClick={() => openEditSizeModal(index)}>
                        <SquarePen className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" type="button" onClick={() => openDeleteSizeModal(index)} disabled={loading}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          <Table>
            <TableCaption>A list of selected styles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Style</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedStyles.map((style, index) => (
                <TableRow key={index}>
                  <TableCell>{style}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStyle(style)}
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

export default ProductForm;
