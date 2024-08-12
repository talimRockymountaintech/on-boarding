"use client"
import React, { useState } from 'react'

const useModalHook = (isOpen: boolean) : [boolean,() => void, () => void] => {
    const [openModal, setOpenModal] = useState<boolean>(isOpen);

    const handleOpenModal = (): void => {
        setOpenModal((prev): boolean   => !prev);
    }
    const handleCloseModal = (): void => {
        setOpenModal(false)
    }
    return [openModal, handleOpenModal, handleCloseModal]
}

export default useModalHook