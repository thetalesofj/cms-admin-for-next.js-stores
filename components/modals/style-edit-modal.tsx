'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface StyleEditModalProps {
    isOpen: boolean;
    style: string;
    onClose: () => void;
    onConfirm: (editedStyle: string) => void;
    loading: boolean;
}

export const StyleEditModal: React.FC<StyleEditModalProps> = ({
    isOpen,
    style,
    onClose,
    onConfirm,
    loading
}) => {

    const params = useParams();
    const [editedStyle, setEditedStyle] = useState(style);

    const handleConfirm = async () => {
        await onConfirm(editedStyle);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            fetchStyleDetails();
            setEditedStyle(style)
        }
    }, [isOpen, style]);

    const fetchStyleDetails = async () => {
        try {
            const response = await axios.get(`/api/${params.store_id}/styles/${params.style_id}`); 
            console.log(response)
            console.log('Style Response:', response.data.styles);
            const existing_style = response.data.styles.map(
              (style:any) => style.name
              );
            setEditedStyle(existing_style[0]);
            console.log(existing_style);
            setEditedStyle(existing_style.name);
        } catch (error) {
            console.error("Error fetching style details:", error);
        }
    };

    return (
        <Modal
            title="Edit Style"
            description={`The Style For The Corresponding Products Will Also Be Changed`}
            isOpen={isOpen}
            onClose={onClose}
        >
            <input
                type="text"
                placeholder={`${style}`}
                value={editedStyle || ''}
                onChange={(e) => setEditedStyle(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
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
                    variant="default"
                    onClick={handleConfirm}
                >
                    Save
                </Button>
            </div>
        </Modal>
    );
};