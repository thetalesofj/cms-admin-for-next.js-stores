"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Plus, SquarePen, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertModal } from '@/components/modals/alert-modal';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SubCategory, Category } from '@prisma/client';

const formSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().min(1),
  styles: z.array(z.string().min(1)).optional(),
});

type SubCategoryFormValues = z.infer<typeof formSchema>;

interface SubCategoryFormProps {
  initialData: SubCategory | null;
  categories: Category[];
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [styles, setStyles] = useState<string[]>(initialData?.styles || []);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [styleInput, setStyleInput] = useState('');

  const title = initialData ? 'Edit Sub-Category' : 'Create Sub-Category';
  const description = initialData ? 'Edit a Sub-Category' : 'Add a New Sub-Category';
  const toastMessage = initialData ? 'Sub-Category Updated!' : 'Sub-Category Created!';
  const action = initialData ? 'Save Changes' : 'Create';

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      category_id: initialData?.category_id || '',
      styles: initialData?.styles || [],
    },
  });

  const addStyle = () => {
    const normalizedInput = styleInput.trim().toLowerCase();
    const isDuplicate = styles.some(style => style.toLowerCase() === normalizedInput);
    
    if (isDuplicate) {
      toast.error('Style already exists');
      return;
    }

    if (editIndex !== null) {
      const updatedStyles = [...styles];
      updatedStyles[editIndex] = styleInput;
      setStyles(updatedStyles);
      setEditIndex(null);
    } else {
      setStyles([...styles, styleInput]);
    }
    setStyleInput('');
  };

  const openEditModal = (index: number) => {
    setStyleInput(styles[index]);
    setEditIndex(index);
  };

  const openDeleteModal = (index: number) => {
    const updatedStyles = styles.filter((_, i) => i !== index);
    setStyles(updatedStyles);
  };

  const onSubmit = async (data: SubCategoryFormValues) => {
    try {
      setLoading(true);
      data.styles = styles;
      console.log("Initial Data: ",initialData)
      console.log("Data: ",data)
      const url = `/api/${params.store_id}/sub-categories/${params.subcategory_id}`;
      console.log('Fetching URL:', url);
      if (initialData) {
        await axios.patch(`/api/${params.store_id}/sub-categories/${params.subcategory_id}`, data);
      } else {
        await axios.post(`/api/${params.store_id}/sub-categories`, data);
      }
      router.refresh();
      router.push(`/${params.store_id}/sub-categories`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.store_id}/sub-categories/${params.subcategory_id}`);
      router.refresh();
      router.push(`/${params.store_id}/sub-categories`);
      toast.success('Sub-Category Deleted.');
    } catch (error: any) {
      toast.error('Make Sure You Have Removed All Products Using This Sub-Category First.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Sub-Category Name" {...field} value={field.value || ''} />
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
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value || ''} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
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
          </div>
          <FormField
            control={form.control}
            name="styles"
            render={() => (
              <FormItem>
                <FormLabel>Style Name(s)</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Input
                      disabled={loading}
                      placeholder="E.g. Trainers"
                      value={styleInput}
                      onChange={(e) => setStyleInput(e.target.value)}
                    />
                    <Button type="button" size="sm" onClick={addStyle} disabled={!styleInput}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Table>
            <TableCaption>A list of styles for the correlating category and sub-category</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Styles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style, index) => (
                <TableRow key={index}>
                  <TableCell>{style}</TableCell>
                  <TableCell className="space-x-4">
                    <Button variant="secondary" size="sm" type="button" onClick={() => openEditModal(index)}>
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" type="button" onClick={() => openDeleteModal(index)} disabled={loading}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SubCategoryForm;
