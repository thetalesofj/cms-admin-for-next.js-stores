'use client'

import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brand } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

interface BrandFormProps {
    initialData: Brand | null;
}

const formSchema = z.object({
    name: z.string().min(1)
})

type BrandFormValues = z.infer<typeof formSchema>

const BrandForm : React.FC<BrandFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Brand" : "Create Brand";
    const description = initialData ? "Edit a Brand" : "Add a New Brand";
    const toastMessage = initialData ? "Brand Updated!" : "Brand Created!";
    const action = initialData ? "Save Changes" : "Create";

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?? {
            name: ''
        }
    });

    const onSubmit = async (data: BrandFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/brands/${params.brandId}`, data);
            }   else {
                await axios.post(`/api/${params.storeId}/brands`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/brands`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/brands/${params.brandId}`);
            router.refresh();
            router.push(`/${params.storeId}/brands`)
            toast.success("Brand Deleted.")
        } catch (error : any) {
            toast.error("Make Sure You Have Removed All Products Using This Brand First.")
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
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Brand name" {...field} />
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
 
export default BrandForm;