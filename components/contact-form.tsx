import { Database } from "@/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, MessageCircle, Eye, Heart } from "lucide-react";

export default function ContactForm({ property }: { property: Database["public"]["Tables"]["properties"]["Row"] }) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between">
                <div className="flex w-full gap-4">
                    {property.contact_full_name && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <p className="text-sm truncate">{property.contact_full_name}</p>
                        </div>
                    )}

                    {property.contact_phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <p className="text-sm truncate">{property.contact_phone}</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-red-50 border-red-200 hover:bg-red-100 hover:text-red-700"
                        onClick={(e) => { e.stopPropagation() }}
                    >
                        <Heart className="h-4 w-4 text-red-600" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                        asChild
                    >
                        <a href="#" title="Live Chat">
                            <MessageCircle className="h-4 w-4 text-blue-600" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}