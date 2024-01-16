'use client'

import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubCategory, Category } from "@prisma/client";
import axios from "axios";
import { Plus, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { StyleClient } from './components/client'
import * as z from "zod";
import { StyleColumn } from "./components/columns";


interface SubCategoryFormProps {
    initialData: SubCategory | null;
    categories: Category[];
}

const stylesArray = z.string().min(1)

const formSchema = z.object({
    name: z.string().min(1),
    category_id: z.string().min(1),
    styles: z.string().min(1)
})

type SubCategoryFormValues = z.infer<typeof formSchema>

const SubCategoryForm : React.FC<SubCategoryFormProps> = ({
    initialData,
    categories
}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const title = initialData ? "Edit Sub-Category" : "Create Sub-Category";
    const description = initialData ? "Edit a Sub-Category" : "Add a New Sub-Category";
    const toastSubMessage = initialData ? "Sub-Category Updated!" : "Sub-Category Created!";
    const action = initialData ? "Save Changes" : "Create";

    const form = useForm<SubCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?? {
            name: '',
            category_id: '',
            styles: ''
        }
    });

    const onSubmit = async (data: SubCategoryFormValues) => {
        try {
            setLoading(true);
            data.styles = Array.isArray(data.styles) ? data.styles : [data.styles];
            if (initialData) {
                await axios.patch(`/api/${params.store_id}/sub-categories/${params.subcategory_id}`, data);
            }   else {
                await axios.post(`/api/${params.store_id}/sub-categories`, data);
            }
            router.refresh();
            router.push(`/${params.store_id}/sub-categories`)
            toast.success(toastSubMessage);
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.store_id}/sub-categories/${params.subcategory_id}`);
            router.refresh();
            router.push(`/${params.store_id}/sub-categories`)
            toast.success("Sub-Category Deleted.")
        } catch (error) {
            toast.error("Make Sure You Have Removed All Styles Using This Sub-Category First.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return ( 
        <>
        <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                { initialData && (
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
            <Form
            {...form}
            >
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
                                                <SelectItem
                                                key={category.id}
                                                value={category.id}
                                                >
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
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="styles"
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
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            const newStyleName = field.value;
                                                if (newStyleName.length > 0) {
                                                    const stylesArray = Array.isArray(field.value)
                                                    ? field.value
                                                    : [];
                                                  field.onChange([...stylesArray, newStyleName]);
                                                  field.onChange('');
                                                  field.onBlur();
                                            }
                                        }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    {/* Table for Styles */}
                    <StyleClient data={form.getValues().styles as unknown as StyleColumn[]}  />
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
     );
}
 
export default SubCategoryForm;