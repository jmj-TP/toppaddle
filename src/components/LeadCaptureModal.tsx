import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, Mail, User, ShieldCheck, ShoppingBag, Globe } from "lucide-react";
import { WheelPicker } from "@/components/ui/WheelPicker";

import { leadService } from "@/services/leadService";

interface LeadCaptureModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    equipmentDetails: any;
    onSuccess?: () => void;
}

export default function LeadCaptureModal({
    isOpen,
    onOpenChange,
    equipmentDetails,
    onSuccess,
}: LeadCaptureModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [quoteFor, setQuoteFor] = useState("complete");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const leadData = {
                name,
                email,
                country,
                quoteFor,
                equipmentType: equipmentDetails?.type || 'main',
                equipmentDetails: equipmentDetails?.data || equipmentDetails,
                timestamp: new Date().toISOString(),
            };

            const result = await leadService.submitLead(leadData);

            if (result.success) {
                setIsSuccess(true);
                toast.success("Request sent successfully!", {
                    description: "We've shared your request with our partner shops.",
                });
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            toast.error("Failed to send request", {
                description: "Please try again later or contact support.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md text-center p-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Excellent Choice!</DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                            We've sent your custom configuration to top table tennis shops.
                            Expect to receive the best quotes in your inbox within 24 hours.
                        </DialogDescription>
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="mt-6 w-full h-12 rounded-full"
                        >
                            Continue Exploring
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-none shadow-2xl">
                <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 p-4 sm:p-6">
                    <DialogHeader className="space-y-2 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold w-fit">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Trusted Lead Generation
                        </div>
                        <DialogTitle className="text-xl font-headline font-bold tracking-tight">
                            Get the Best Price <span className="text-primary">for Your Perfect Setup</span>
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                            Enter your details below. We'll find the best available quotes from certified table tennis retailers for your specific configuration.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Alex Smith"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="alex@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Country selector */}
                        <div className="space-y-1.5">
                            <Label htmlFor="country" className="text-sm font-semibold flex items-center gap-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                Your Country
                            </Label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                className="w-full h-11 px-3 rounded-xl border border-muted-foreground/20 bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="">Select your country...</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Austria">Austria</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Poland">Poland</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Norway">Norway</option>
                                <option value="Finland">Finland</option>
                                <option value="Spain">Spain</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Italy">Italy</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Ireland">Ireland</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Japan">Japan</option>
                                <option value="China">China</option>
                                <option value="South Korea">South Korea</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Quote selector wheel */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                I want a quote for...
                            </Label>
                            <div className="bg-background/60 rounded-2xl border border-border/50 overflow-hidden">
                                <WheelPicker
                                    value={quoteFor}
                                    onChange={setQuoteFor}
                                    options={[
                                        { value: 'complete', label: '🏓 Complete Setup' },
                                        { value: 'blade', label: '🪵 Blade Only' },
                                        { value: 'fh_rubber', label: '⬛ Forehand Rubber Only' },
                                        { value: 'bh_rubber', label: '⬜ Backhand Rubber Only' },
                                        { value: 'both_rubbers', label: '🔲 Both Rubbers' },
                                        { value: 'blade_fh', label: '🔶 Blade + Forehand Rubber' },
                                        { value: 'blade_bh', label: '🔷 Blade + Backhand Rubber' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-3 border border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3" />
                                Your Privacy Matters
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                By submitting, you agree to have your contact details and equipment preferences shared with certified table tennis retailers who may contact you with personalized pricing offers. You may unsubscribe from retailer communications at any time. View our{" "}
                                <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-base font-bold rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Finding Best Quotes..." : "Request Personalized Quotes"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
