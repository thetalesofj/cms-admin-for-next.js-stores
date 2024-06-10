'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface StyleDeleteModalProps {
    isOpen: boolean,
    style: string,
    onClose: () => void,
    onConfirm: () => void,
    loading: boolean,
}

export const StyleDeleteModal: React.FC<StyleDeleteModalProps> = ({
    isOpen,
    style,
    onClose,
    onConfirm,
    loading
}) => {

    const params = useParams();
    const [existingStyle, setExistingStyle] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchStyleDetails();
        }
    }, [isOpen]);

    const fetchStyleDetails = async () => {
        try {
            const response = await axios.get(`/api/${params.store_id}/styles/${params.style_id}`); 
            console.log(response)
            const existing_style_name = response.data.styles;
            console.log(existing_style_name)
            setExistingStyle(existing_style_name.name);
        } catch (error) {
            console.error("Error fetching style details:", error);
        }
    };

    return (
        <Modal
            title="Are You Sure?"
            description={`Are you sure you want to delete the style "${style}"? This action cannot be undone.`}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div
            className="pt-6 space-x-2 flex items-center justify-end w-full"
            >
                <Button
                type="button"
                disabled={loading} 
                variant="outline"
                onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                type="button"
                disabled={loading} 
                variant="destructive"
                onClick={onConfirm}
                >
                    Continue
                </Button>
            </div>
        </Modal>
    )
}