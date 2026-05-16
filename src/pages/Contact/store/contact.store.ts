import { contactService } from './../services/contact.service';
"use client";

import { create } from "zustand";
import type { TContact, TCreateContact } from "../types/contact.type";

type TContactQuery = {
    limit: number;
    search: string;
    source: string;
    status: string;
    tags: string[];
};

type TContactStore = {
    contacts: TContact[];
    loadingContacts: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    selectedContactId: string | null;
    contactQuery: TContactQuery;
    open: boolean;
    setOpen: (open: boolean) => void;
    setCurrentPage: (page: number) => void;
    fetchContacts: (accountId: string) => Promise<void>;
    createContact: (data: TCreateContact) => Promise<void>;
    setSelectedContactId: (contactId: string | null) => void;
    getSelectedContact: () => TContact | undefined;
};

const initialContactQuery: TContactQuery = {
    limit: 20,
    search: "",
    source: "",
    status: "",
    tags: [],
};

export const useContactStore = create<TContactStore>((set, get) => ({
    contacts: [],
    loadingContacts: false,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,

    selectedContactId: null,
    open: false,
    contactQuery: initialContactQuery,

    setOpen: (open: boolean) => {
        set({
            open: open
        })
    },
    setCurrentPage: (page) => {
        const current =
            get().currentPage;

        if (current === page)
            return;

        set({
            currentPage: page,
        });
    },


    fetchContacts: async (accountId: string) => {
        try {
            set({ loadingContacts: true });

            // const query = get().contactQuery;
            const { contactQuery, currentPage, } = get();

            const payload = {
                accountId,
                pageIndex: currentPage,
                rowPerPage: contactQuery.limit,
                search: contactQuery.search,
                source: contactQuery.source,
                status: contactQuery.status,
                tags: contactQuery.tags,
            };

            console.log("Fetch contacts payload:", payload);

            const response = await contactService.getContacts(payload)
            console.log("response", response.data.docs)
            const contacts = response?.data?.docs || [];

            set({
                contacts,
                totalPages: response.data?.pagination?.totalPages,
                totalItems: response.data.pagination?.totalDocs
            })
        } catch (error) {
            console.error("Fetch contacts error", error);
        } finally {
            set({ loadingContacts: false });
        }
    },

    createContact: async (payload: TCreateContact) => {
        try {
            const response = await contactService.createContact(payload);
            const newContact = response?.data?.docs;

            set((state) => ({
                contacts: [
                    ...(Array.isArray(newContact) ? newContact : [newContact]),
                    ...state.contacts,
                ],
                open: false
            }));
        } catch (error) {
            console.error("Create contact error", error);
        } finally {
            set({ loadingContacts: false });
        }
    },

    setSelectedContactId: (contactId) => {
        set({ selectedContactId: contactId });
    },

    getSelectedContact: () => {
        const { contacts, selectedContactId } = get();

        return contacts.find(
            (contact) => contact.id === selectedContactId
        );
    },
})
);