import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductFilters } from '@/components/configurator/ProductFilter';

interface ConfiguratorState {
    isPreassembled: boolean;
    selectedBladeName: string | null;
    selectedForehandName: string | null;
    selectedBackhandName: string | null;
    selectedRacketName: string | null;

    selectedGrip: string;
    selectedForehandThickness: string;
    selectedBackhandThickness: string;
    selectedForehandColor: string;
    selectedBackhandColor: string;

    assembleForMe: boolean;
    sealsService: boolean;

    forehandFilters: ProductFilters;
    bladeFilters: ProductFilters;
    backhandFilters: ProductFilters;

    // Actions
    setIsPreassembled: (val: boolean) => void;
    setSelectedBladeName: (name: string | null) => void;
    setSelectedForehandName: (name: string | null) => void;
    setSelectedBackhandName: (name: string | null) => void;
    setSelectedRacketName: (name: string | null) => void;

    setSelectedGrip: (grip: string) => void;
    setSelectedForehandThickness: (val: string) => void;
    setSelectedBackhandThickness: (val: string) => void;
    setSelectedForehandColor: (val: string) => void;
    setSelectedBackhandColor: (val: string) => void;

    setAssembleForMe: (val: boolean) => void;
    setSealsService: (val: boolean) => void;

    setForehandFilters: (filters: ProductFilters) => void;
    setBladeFilters: (filters: ProductFilters) => void;
    setBackhandFilters: (filters: ProductFilters) => void;
}

const defaultFilters: ProductFilters = {
    maxPrice: 999999,
    level: ["All"],
    style: ["All"],
    brand: ["All"],
};

export const useConfiguratorStore = create<ConfiguratorState>()(
    persist(
        (set) => ({
            isPreassembled: false,
            selectedBladeName: null,
            selectedForehandName: null,
            selectedBackhandName: null,
            selectedRacketName: null,

            selectedGrip: "FL",
            selectedForehandThickness: "",
            selectedBackhandThickness: "",
            selectedForehandColor: "Red",
            selectedBackhandColor: "Black",

            assembleForMe: false,
            sealsService: false,

            forehandFilters: { ...defaultFilters },
            bladeFilters: { ...defaultFilters },
            backhandFilters: { ...defaultFilters },

            setIsPreassembled: (isPreassembled) => set({ isPreassembled }),
            setSelectedBladeName: (selectedBladeName) => set({ selectedBladeName }),
            setSelectedForehandName: (selectedForehandName) => set({ selectedForehandName }),
            setSelectedBackhandName: (selectedBackhandName) => set({ selectedBackhandName }),
            setSelectedRacketName: (selectedRacketName) => set({ selectedRacketName }),

            setSelectedGrip: (selectedGrip) => set({ selectedGrip }),
            setSelectedForehandThickness: (selectedForehandThickness) => set({ selectedForehandThickness }),
            setSelectedBackhandThickness: (selectedBackhandThickness) => set({ selectedBackhandThickness }),
            setSelectedForehandColor: (selectedForehandColor) => set({ selectedForehandColor }),
            setSelectedBackhandColor: (selectedBackhandColor) => set({ selectedBackhandColor }),

            setAssembleForMe: (assembleForMe) => set({ assembleForMe }),
            setSealsService: (sealsService) => set({ sealsService }),

            setForehandFilters: (forehandFilters) => set({ forehandFilters }),
            setBladeFilters: (bladeFilters) => set({ bladeFilters }),
            setBackhandFilters: (backhandFilters) => set({ backhandFilters }),
        }),
        {
            name: 'configurator-storage',
        }
    )
);
