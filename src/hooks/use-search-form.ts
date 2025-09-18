// src/hooks/use-search-form.ts

import { useState } from "react";
import { useToast } from "@/hooks/use-toast"; // Gunakan toast

// Definisikan tipe state untuk form
export interface SearchFormState {
  destination: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
}

const initialState: SearchFormState = {
  destination: "",
  checkIn: undefined,
  checkOut: undefined,
  guests: "1",
};

export function useSearchForm(onSearch: (query: SearchFormState | null) => void) {
  const [formState, setFormState] = useState<SearchFormState>(initialState);
  const { toast } = useToast();

  const setFieldValue = <K extends keyof SearchFormState>(field: K, value: SearchFormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const { destination, checkIn, checkOut } = formState;
    if (!destination || !checkIn || !checkOut) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in destination, check-in, and check-out dates.",
        variant: "destructive",
      });
      return;
    }
    onSearch(formState);
  };
  
  const handleReset = () => {
    setFormState(initialState);
    onSearch(null);
  };

  return { formState, setFieldValue, handleSearch, handleReset };
}