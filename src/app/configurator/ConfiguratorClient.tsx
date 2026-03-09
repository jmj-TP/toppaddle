'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlotMachine from "@/components/configurator/SlotMachine";
import StatsDisplay, { type UserPreferences } from "@/components/configurator/StatsDisplay";
import type { Blade, Rubber, PreAssembledRacket } from "@/data/products";
import type { Inventory } from "@/utils/ratingSystem";
import { toast } from "sonner";
import StructuredData from "@/components/StructuredData";
import { useCartStore } from "@/stores/cartStore";
import { useComparisonStore, type ComparisonPaddle } from "@/stores/comparisonStore";
import tableTennisImage from "@/assets/table-tennis.png";
import { HelpCircle, ArrowRight } from "lucide-react";
import { ProductFilters } from "@/components/configurator/ProductFilter";
import ReviewStrip from "@/components/configurator/ReviewStrip";
import StickyDecisionBar from "@/components/configurator/StickyDecisionBar";
import { applySpongeMultipliers } from "@/utils/spongeCalculations";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { useReviews } from "@/hooks/useReviews";
import { getProductImage } from "@/utils/addProductImages";
import { slugify } from "@/lib/googleSheets";
import { useConfiguratorStore } from "@/stores/configuratorStore";
import Image from "next/image";


function ConfiguratorReviews({ blade, fhRubber, bhRubber }: { blade: string; fhRubber: string; bhRubber: string }) {
    const { matchingReviews, isLoading } = useReviews(blade, fhRubber, bhRubber);
    return (
        <div className="mt-8 px-4">
            <ReviewsCarousel
                reviews={matchingReviews}
                isLoading={isLoading}
                currentBlade={blade}
                currentFhRubber={fhRubber}
                currentBhRubber={bhRubber}
            />
        </div>
    );
}

export default function ConfiguratorClient({ inventory }: { inventory: Inventory }) {
    const mergedBlades = inventory?.blades || [];
    const mergedRubbers = inventory?.rubbers || [];
    const mergedRackets = inventory?.preAssembledRackets || [];

    if (!mergedBlades.length || !mergedRubbers.length) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col space-y-4 text-center">
                <h2 className="text-xl font-bold text-destructive">Database Connection Error</h2>
                <p className="text-muted-foreground w-3/4 max-w-md">The configurator could not load product data from the database. Please check your network connection or try refreshing the page.</p>
            </div>
        );
    }

    const searchParams = useSearchParams();
    const router = useRouter();

    const addItem = useCartStore(state => state.addItem);
    const addPaddle = useComparisonStore(state => state.addPaddle);
    const comparisonPaddles = useComparisonStore(state => state.paddles);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadEquipmentDetail, setLeadEquipmentDetail] = useState<any>(null);

    // Store state and actions
    const store = useConfiguratorStore();

    // UI local state that doesn't need persistence or is transient
    const [isPreassembled, setIsPreassembled] = useState(store.isPreassembled);
    const [selectedBlade, setSelectedBlade] = useState<Blade>(
        mergedBlades.find(b => b.Blade_Name === store.selectedBladeName) || mergedBlades[0]
    );
    const [selectedForehand, setSelectedForehand] = useState<Rubber>(
        mergedRubbers.find(r => r.Rubber_Name === store.selectedForehandName) || mergedRubbers[0]
    );
    const [selectedBackhand, setSelectedBackhand] = useState<Rubber>(
        mergedRubbers.find(r => r.Rubber_Name === store.selectedBackhandName) || mergedRubbers[1]
    );
    const [selectedRacket, setSelectedRacket] = useState<PreAssembledRacket>(
        mergedRackets.find(r => r.Racket_Name === store.selectedRacketName) || mergedRackets[0]
    );

    const [assembleForMe, setAssembleForMe] = useState(store.assembleForMe);
    const [sealsService, setSealsService] = useState(store.sealsService);
    const [selectedGrip, setSelectedGrip] = useState<string>(store.selectedGrip);
    const [selectedForehandThickness, setSelectedForehandThickness] = useState<string>(store.selectedForehandThickness);
    const [selectedBackhandThickness, setSelectedBackhandThickness] = useState<string>(store.selectedBackhandThickness);
    const [selectedForehandColor, setSelectedForehandColor] = useState<string>(store.selectedForehandColor);
    const [selectedBackhandColor, setSelectedBackhandColor] = useState<string>(store.selectedBackhandColor);

    const [forehandFilters, setForehandFilters] = useState<ProductFilters>(store.forehandFilters);
    const [bladeFilters, setBladeFilters] = useState<ProductFilters>(store.bladeFilters);
    const [backhandFilters, setBackhandFilters] = useState<ProductFilters>(store.backhandFilters);

    // Sync local state to store
    useEffect(() => store.setIsPreassembled(isPreassembled), [isPreassembled]);
    useEffect(() => store.setSelectedBladeName(selectedBlade?.Blade_Name), [selectedBlade]);
    useEffect(() => store.setSelectedForehandName(selectedForehand?.Rubber_Name), [selectedForehand]);
    useEffect(() => store.setSelectedBackhandName(selectedBackhand?.Rubber_Name), [selectedBackhand]);
    useEffect(() => store.setSelectedRacketName(selectedRacket?.Racket_Name), [selectedRacket]);
    useEffect(() => store.setAssembleForMe(assembleForMe), [assembleForMe]);
    useEffect(() => store.setSealsService(sealsService), [sealsService]);
    useEffect(() => store.setSelectedGrip(selectedGrip), [selectedGrip]);
    useEffect(() => store.setSelectedForehandThickness(selectedForehandThickness), [selectedForehandThickness]);
    useEffect(() => store.setSelectedBackhandThickness(selectedBackhandThickness), [selectedBackhandThickness]);
    useEffect(() => store.setSelectedForehandColor(selectedForehandColor), [selectedForehandColor]);
    useEffect(() => store.setSelectedBackhandColor(selectedBackhandColor), [selectedBackhandColor]);
    useEffect(() => store.setForehandFilters(forehandFilters), [forehandFilters]);
    useEffect(() => store.setBladeFilters(bladeFilters), [bladeFilters]);
    useEffect(() => store.setBackhandFilters(backhandFilters), [backhandFilters]);

    const [forehandFilterOpen, setForehandFilterOpen] = useState(false);
    const [bladeFilterOpen, setBladeFilterOpen] = useState(false);
    const [backhandFilterOpen, setBackhandFilterOpen] = useState(false);

    // Spin trigger for slot machine
    const [spinTrigger, setSpinTrigger] = useState(0);

    // Refs for scrolling to sections
    const forehandRef = useRef<HTMLDivElement>(null);
    const bladeRef = useRef<HTMLDivElement>(null);
    const backhandRef = useRef<HTMLDivElement>(null);

    // Auto-swap rubber colors to prevent matching colors
    const handleForehandColorChange = (color: string) => {
        setSelectedForehandColor(color);
        setSelectedBackhandColor(color === "Red" ? "Black" : "Red");
    };

    const handleBackhandColorChange = (color: string) => {
        setSelectedBackhandColor(color);
        setSelectedForehandColor(color === "Red" ? "Black" : "Red");
    };

    // Sync local state to store
    useEffect(() => store.setIsPreassembled(isPreassembled), [isPreassembled]);
    useEffect(() => store.setSelectedBladeName(selectedBlade?.Blade_Name), [selectedBlade]);
    useEffect(() => store.setSelectedForehandName(selectedForehand?.Rubber_Name), [selectedForehand]);
    useEffect(() => store.setSelectedBackhandName(selectedBackhand?.Rubber_Name), [selectedBackhand]);
    useEffect(() => store.setSelectedRacketName(selectedRacket?.Racket_Name), [selectedRacket]);
    useEffect(() => store.setAssembleForMe(assembleForMe), [assembleForMe]);
    useEffect(() => store.setSealsService(sealsService), [sealsService]);
    useEffect(() => store.setSelectedGrip(selectedGrip), [selectedGrip]);
    useEffect(() => store.setSelectedForehandThickness(selectedForehandThickness), [selectedForehandThickness]);
    useEffect(() => store.setSelectedBackhandThickness(selectedBackhandThickness), [selectedBackhandThickness]);
    useEffect(() => store.setSelectedForehandColor(selectedForehandColor), [selectedForehandColor]);
    useEffect(() => store.setSelectedBackhandColor(selectedBackhandColor), [selectedBackhandColor]);
    useEffect(() => store.setForehandFilters(forehandFilters), [forehandFilters]);
    useEffect(() => store.setBladeFilters(bladeFilters), [bladeFilters]);
    useEffect(() => store.setBackhandFilters(backhandFilters), [backhandFilters]);

    // Handle URL parameters (highest priority on mount)
    useEffect(() => {
        const bladeParam = searchParams.get("blade");
        const fhParam = searchParams.get("fh");
        const bhParam = searchParams.get("bh");
        const racketParam = searchParams.get("racket");
        const handleParam = searchParams.get("handle");
        const preassembledParam = searchParams.get("preassembled");

        if (handleParam) {
            setSelectedGrip(handleParam);
        }

        if (preassembledParam === "true" && racketParam) {
            const slug = slugify(racketParam);
            const racket = mergedRackets.find(r => r.Racket_Name === racketParam || slugify(r.Racket_Name) === slug);
            if (racket) {
                setIsPreassembled(true);
                setSelectedRacket(racket);
            }
        } else if (bladeParam || fhParam || bhParam) {
            if (bladeParam) {
                const slug = slugify(bladeParam);
                const blade = mergedBlades.find(b => b.Blade_Name === bladeParam || slugify(b.Blade_Name) === slug);
                if (blade) setSelectedBlade(blade);
            }
            if (fhParam) {
                const slug = slugify(fhParam);
                const rubber = mergedRubbers.find(r => r.Rubber_Name === fhParam || slugify(r.Rubber_Name) === slug);
                if (rubber) setSelectedForehand(rubber);
            }
            if (bhParam) {
                const slug = slugify(bhParam);
                const rubber = mergedRubbers.find(r => r.Rubber_Name === bhParam || slugify(r.Rubber_Name) === slug);
                if (rubber) setSelectedBackhand(rubber);
            }
        }
    }, [searchParams]);


    const handleRandomReroll = () => {
        setSpinTrigger(prev => prev + 1);
    };

    const handlePreferencesChange = (preferences: UserPreferences) => {
        // Handle preferences change logic
        toast.success("Preferences updated!");
    };

    const calculateStats = () => {
        if (isPreassembled) {
            return {
                speed: selectedRacket.Racket_Speed,
                spin: selectedRacket.Racket_Spin,
                control: selectedRacket.Racket_Control,
                power: Math.round((selectedRacket.Racket_Speed + selectedRacket.Racket_Spin) / 2),
                price: selectedRacket.Racket_Price,
            };
        } else {
            // Apply sponge multipliers to rubber stats
            const forehandAdjusted = applySpongeMultipliers(
                {
                    speed: selectedForehand?.Rubber_Speed || 0,
                    control: selectedForehand?.Rubber_Control || 0,
                    power: selectedForehand?.Rubber_Power || Math.round(((selectedForehand?.Rubber_Speed || 0) + (selectedForehand?.Rubber_Spin || 0)) / 2),
                    spin: selectedForehand?.Rubber_Spin || 0,
                },
                selectedForehandThickness
            );

            const backhandAdjusted = applySpongeMultipliers(
                {
                    speed: selectedBackhand?.Rubber_Speed || 0,
                    control: selectedBackhand?.Rubber_Control || 0,
                    power: selectedBackhand?.Rubber_Power || Math.round(((selectedBackhand?.Rubber_Speed || 0) + (selectedBackhand?.Rubber_Spin || 0)) / 2),
                    spin: selectedBackhand?.Rubber_Spin || 0,
                },
                selectedBackhandThickness
            );

            const speed = Math.round(((selectedBlade?.Blade_Speed || 0) + forehandAdjusted.speed + backhandAdjusted.speed) / 3);
            const spin = Math.round(((selectedBlade?.Blade_Spin || 0) + forehandAdjusted.spin + backhandAdjusted.spin) / 3);
            const control = Math.round(((selectedBlade?.Blade_Control || 0) + forehandAdjusted.control + backhandAdjusted.control) / 3);
            const power = Math.round((speed + spin) / 2);
            const totalPrice = (selectedBlade?.Blade_Price || 0) + (selectedForehand?.Rubber_Price || 0) + (selectedBackhand?.Rubber_Price || 0) + (sealsService ? 5.49 : 0) + (assembleForMe ? 0 : 0);

            return { speed, spin, control, power, price: totalPrice };
        }
    };

    const handleRequestQuotes = () => {
        const stats = calculateStats();
        setLeadEquipmentDetail({
            type: isPreassembled ? 'pre' : 'custom',
            data: isPreassembled ? selectedRacket : {
                blade: selectedBlade,
                forehand: selectedForehand,
                backhand: selectedBackhand,
                forehandThickness: selectedForehandThickness,
                backhandThickness: selectedBackhandThickness,
                handleType: selectedGrip,
                assemble: assembleForMe,
                seal: sealsService
            },
            score: 100,
            rank: 1
        });
        setIsLeadModalOpen(true);
    };

    const handleAddToCompare = () => {
        if (comparisonPaddles.length >= 3) {
            toast.error("Comparison is full", {
                description: "Please clear the comparison section to add more paddles"
            });
            return;
        }

        try {
            const stats = calculateStats();
            const comparisonPaddle: ComparisonPaddle = isPreassembled ? {
                id: `racket-${selectedRacket.Racket_Name}-${Date.now()}`,
                name: selectedRacket.Racket_Name,
                image: getProductImage(selectedRacket, 'racket'),
                speed: selectedRacket.Racket_Speed,
                control: selectedRacket.Racket_Control,
                power: stats.power,
                spin: selectedRacket.Racket_Spin,
                price: selectedRacket.Racket_Price,
                weight: 180,
                level: selectedRacket.Racket_Level as "Beginner" | "Intermediate" | "Advanced",
                blade: selectedRacket.Racket_Blade,
                forehandRubber: selectedRacket.Racket_FH_Rubber,
                backhandRubber: selectedRacket.Racket_BH_Rubber,
            } : {
                id: `custom-${selectedBlade.Blade_Name}-${Date.now()}`,
                name: `${selectedBlade.Blade_Name} (Custom)`,
                image: getProductImage(selectedBlade, 'blade'),
                speed: stats.speed,
                control: stats.control,
                power: stats.power,
                spin: stats.spin,
                price: stats.price,
                weight: (selectedBlade?.Blade_Weight || 85) + (selectedForehand?.Rubber_Weight || 45) + (selectedBackhand?.Rubber_Weight || 45),
                level: (selectedBlade?.Blade_Level || "Intermediate") as "Beginner" | "Intermediate" | "Advanced",
                blade: selectedBlade?.Blade_Name || 'Custom Blade',
                bladeImage: selectedBlade ? getProductImage(selectedBlade, 'blade') : tableTennisImage as string,
                forehandRubber: selectedForehand?.Rubber_Name || 'Custom Forehand',
                forehandImage: selectedForehand ? getProductImage(selectedForehand, 'rubber') : tableTennisImage as string,
                backhandRubber: selectedBackhand?.Rubber_Name || 'Custom Backhand',
                backhandImage: selectedBackhand ? getProductImage(selectedBackhand, 'rubber') : tableTennisImage as string,
                forehandSponge: selectedForehandThickness,
                backhandSponge: selectedBackhandThickness,
                bladeStats: {
                    speed: selectedBlade?.Blade_Speed || 0,
                    control: selectedBlade?.Blade_Control || 0,
                    power: selectedBlade?.Blade_Power || 0,
                    spin: 0,
                    price: selectedBlade?.Blade_Price || 0
                },
                forehandStats: applySpongeMultipliers(
                    {
                        speed: selectedForehand?.Rubber_Speed || 0,
                        control: selectedForehand?.Rubber_Control || 0,
                        power: selectedForehand?.Rubber_Power || Math.round(((selectedForehand?.Rubber_Speed || 0) + (selectedForehand?.Rubber_Spin || 0)) / 2),
                        spin: selectedForehand?.Rubber_Spin || 0,
                    },
                    selectedForehandThickness
                ) as any,
                backhandStats: applySpongeMultipliers(
                    {
                        speed: selectedBackhand?.Rubber_Speed || 0,
                        control: selectedBackhand?.Rubber_Control || 0,
                        power: selectedBackhand?.Rubber_Power || Math.round(((selectedBackhand?.Rubber_Speed || 0) + (selectedBackhand?.Rubber_Spin || 0)) / 2),
                        spin: selectedBackhand?.Rubber_Spin || 0,
                    },
                    selectedBackhandThickness
                ) as any
            };

            // Add price to stats after applying sponge multipliers
            if (!isPreassembled) {
                if (comparisonPaddle.forehandStats) {
                    comparisonPaddle.forehandStats.price = selectedForehand?.Rubber_Price || 0;
                }
                if (comparisonPaddle.backhandStats) {
                    comparisonPaddle.backhandStats.price = selectedBackhand?.Rubber_Price || 0;
                }
            }

            addPaddle(comparisonPaddle);

            toast.success("Added to comparison", {
                description: "View your comparison list",
                action: {
                    label: "View",
                    onClick: () => router.push("/compare")
                }
            });
        } catch (error) {
            console.error("Error adding to comparison:", error);
            toast.error("Failed to add to comparison");
        }
    };

    const stats = calculateStats();

    const handleChipClick = (section: 'forehand' | 'blade' | 'backhand') => {
        const ref = section === 'forehand' ? forehandRef : section === 'blade' ? bladeRef : backhandRef;
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.current?.focus();
    };

    return (
        <div className="min-h-screen flex flex-col pb-[15vh] overflow-x-hidden">
            <StructuredData
                data={{
                    type: 'BreadcrumbList',
                    items: [
                        { name: 'Home', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/' },
                        { name: 'Configurator', url: 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com/configurator' }
                    ]
                }}
            />
            <Header />

            <main className="flex-1 bg-background border-t border-border/10 overflow-hidden relative">
                <div className="container mx-auto px-4 py-8">
                    {/* Help Banner */}
                    <div className="mb-8 max-w-3xl mx-auto">
                        <Link
                            href="/"
                            className="block group bg-card hover:bg-muted/30 border border-border rounded-2xl p-4 transition-all duration-300"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <HelpCircle className="w-4 h-4 text-accent flex-shrink-0" />
                                <div className="flex-1 text-center">
                                    <p className="text-sm font-medium text-foreground">
                                        Help me choose — Answer a few questions to find the best paddle.
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold mb-6 text-foreground">Configure Your Perfect Paddle</h1>
                        <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1">
                            <button
                                onClick={() => setIsPreassembled(false)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isPreassembled
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Custom Build
                            </button>
                            <button
                                onClick={() => setIsPreassembled(true)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isPreassembled
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Pre-Assembled
                            </button>
                        </div>
                    </div>

                    {/* Slot Machine Section */}
                    <div className="mb-12" ref={bladeRef}>
                        <SlotMachine
                            isPreassembled={isPreassembled}
                            selectedBlade={selectedBlade}
                            selectedForehand={selectedForehand}
                            selectedBackhand={selectedBackhand}
                            selectedRacket={selectedRacket}
                            onBladeChange={setSelectedBlade}
                            onForehandChange={setSelectedForehand}
                            onBackhandChange={setSelectedBackhand}
                            onRacketChange={setSelectedRacket}
                            spinTrigger={spinTrigger}
                            selectedGrip={selectedGrip}
                            selectedForehandThickness={selectedForehandThickness}
                            selectedBackhandThickness={selectedBackhandThickness}
                            selectedForehandColor={selectedForehandColor}
                            selectedBackhandColor={selectedBackhandColor}
                            onGripChange={setSelectedGrip}
                            onForehandThicknessChange={setSelectedForehandThickness}
                            onBackhandThicknessChange={setSelectedBackhandThickness}
                            onForehandColorChange={handleForehandColorChange}
                            onBackhandColorChange={handleBackhandColorChange}
                            forehandFilters={forehandFilters}
                            bladeFilters={bladeFilters}
                            backhandFilters={backhandFilters}
                            onForehandFiltersChange={setForehandFilters}
                            onBladeFiltersChange={setBladeFilters}
                            onBackhandFiltersChange={setBackhandFilters}
                            forehandFilterOpen={forehandFilterOpen}
                            bladeFilterOpen={bladeFilterOpen}
                            backhandFilterOpen={backhandFilterOpen}
                            onForehandFilterOpenChange={setForehandFilterOpen}
                            onBladeFilterOpenChange={setBladeFilterOpen}
                            onBackhandFilterOpenChange={setBackhandFilterOpen}
                            allBlades={mergedBlades}
                            allRubbers={mergedRubbers}
                            allRackets={mergedRackets}
                        />
                    </div>

                    {/* Stats Display Section */}
                    <StatsDisplay
                        stats={calculateStats()}
                        level={isPreassembled ? selectedRacket.Racket_Level : selectedBlade.Blade_Level}
                        blade={isPreassembled ? null : selectedBlade}
                        forehand={isPreassembled ? null : selectedForehand}
                        backhand={isPreassembled ? null : selectedBackhand}
                        racket={isPreassembled ? selectedRacket : null}
                        onRandomReroll={handleRandomReroll}
                        onPreferencesChange={handlePreferencesChange}
                        onRequestQuotes={handleRequestQuotes}
                        onAddToCompare={handleAddToCompare}
                        isPreassembled={isPreassembled}
                        assembleForMe={assembleForMe}
                        onAssembleChange={setAssembleForMe}
                        sealsService={sealsService}
                        onSealsChange={setSealsService}
                        onBladeChange={setSelectedBlade}
                        onForehandChange={setSelectedForehand}
                        onBackhandChange={setSelectedBackhand}
                        inventory={inventory}
                    />

                    {/* Reviews for this setup */}
                    {!isPreassembled && (
                        <ConfiguratorReviews
                            blade={selectedBlade.Blade_Name}
                            fhRubber={selectedForehand.Rubber_Name}
                            bhRubber={selectedBackhand.Rubber_Name}
                        />
                    )}
                </div>
            </main>

            {/* Review Strip */}
            <ReviewStrip
                totalPrice={stats.price}
                level={isPreassembled ? selectedRacket.Racket_Level : selectedBlade.Blade_Level}
                totalWeight={
                    isPreassembled
                        ? '~180g'
                        : `${(selectedBlade.Blade_Weight || 85) + (selectedForehand.Rubber_Weight || 45) + (selectedBackhand.Rubber_Weight || 45)}g`
                }
                selections={{
                    forehand: isPreassembled ? selectedRacket.Racket_Name : selectedForehand.Rubber_Name,
                    blade: isPreassembled ? selectedRacket.Racket_Name : selectedBlade.Blade_Name,
                    backhand: isPreassembled ? selectedRacket.Racket_Name : selectedBackhand.Rubber_Name,
                }}
                onChipClick={handleChipClick}
            />

            {/* Sticky Decision Bar */}
            <StickyDecisionBar
                totalPrice={calculateStats().price}
                onRequestQuotes={handleRequestQuotes}
                onAddToCompare={handleAddToCompare}
                assembleForMe={assembleForMe}
                onAssembleChange={setAssembleForMe}
                sealsService={sealsService}
                onSealsChange={setSealsService}
                onRandomReroll={handleRandomReroll}
                isPreassembled={isPreassembled}
                racketName={isPreassembled ? selectedRacket?.Racket_Name : selectedBlade?.Blade_Name}
                score={100}
                price={calculateStats().price}
                isCustom={!isPreassembled}
                forehandRubberName={!isPreassembled ? selectedForehand?.Rubber_Name : undefined}
                backhandRubberName={!isPreassembled ? selectedBackhand?.Rubber_Name : undefined}
            />

            <Footer />
            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onOpenChange={setIsLeadModalOpen}
                equipmentDetails={leadEquipmentDetail}
            />
        </div>
    );
}
