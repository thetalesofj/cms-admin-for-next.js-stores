'use client'

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface StyleAlertModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: (index: number) => void,
    loading: boolean,
}

export const StyleAlertModal: React.FC<StyleAlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    },[])

    if (!isMounted) {
        return null
    }

    return (
        <Modal
            title="Are You Sure?"
            description="This Action Cannot Be Undone."
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
                onClick={() => onConfirm}
                >
                    Continue
                </Button>
            </div>
        </Modal>
    )
}