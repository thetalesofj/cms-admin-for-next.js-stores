'use client'

import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubCategory, Category, Style } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

interface SubCategoryFormProps {
    initialData: SubCategory | null;
    styleData: Style | null;
    categories: Category[];
}

const styleArr = z.string().min(1)

const formSchema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
    style: z.array(styleArr)
})

type SubCategoryFormValues = z.infer<typeof formSchema>

const SubCategoryForm : React.FC<SubCategoryFormProps> = ({
    initialData,
    styleData,
    categories
}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [styleOpen, setStyleOpen] = useState(false);
    const [styleLoading, setStyleLoading] = useState(false);

    const title = initialData ? "Edit Sub-Category" : "Create Sub-Category";
    const description = initialData ? "Edit a Sub-Category" : "Add a New Sub-Category";
    const toastSubMessage = initialData ? "Sub-Category Updated!" : "Sub-Category Created!";
    const toastStyleMessage = styleData ? "Style Updated!" : "Style Created!";
    const action = initialData ? "Save Changes" : "Create";

    const form = useForm<SubCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?? {
            name: '',
            categoryId: '',
            style: []
        }
    });

    // Submit and Delete Async Function for Styles

        const styleOnSubmit = async () => {
            try {
                setStyleLoading(true);
                if (styleData) {
                    
                }
                toast.success(toastStyleMessage)
            } catch (error) {
                toast.error("Something Went Wrong")
            } finally {
                setStyleLoading(false)
            }
        }

        const styleOnDelete = async () => {
            try {
                setLoading(true)
                await axios.delete(`/api/${params.storeId}/sub-categories/${params.subCategoryId}/${params.styleId}`);
                router.refresh();
                toast.success("Style Deleted.")
            } catch (error) {
                toast.error("Something Went Wrong.")
            } finally {
                setLoading(false);
                setOpen(false);
            }
        }
    
    
    // Submit and Delete Async Functions for Entire Form

    const onSubmit = async (data: SubCategoryFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sub-categories/${params.subCategoryId}`, data);
            }   else {
                await axios.post(`/api/${params.storeId}/sub-categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sub-categories`)
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
            await axios.delete(`/api/${params.storeId}/sub-categories/${params.subCategoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/sub-categories`)
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
                        name="categoryId"
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
                                    <Input disabled={loading} placeholder="E.g. Shoes" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
     );
}
 
export default SubCategoryForm;