import { Badge } from "@/components/ui/badge";
import { CreditCard } from "@/types/creditCard";

interface CreditCardDisplayProps {
    creditCard: CreditCard;
}

export function CreditCardDisplay({ creditCard }: CreditCardDisplayProps) {
    console.log('credit card display: ', creditCard);
    return (
        <div className="flex justify-center">
            <div
                className="w-[350px] h-[220px] rounded-xl p-6 text-white shadow-xl relative overflow-hidden"
                style={{
                    background: creditCard.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                {/* Textura/patrón de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                {/* Chip simulado */}
                <div className="relative w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-6">
                    <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-yellow-600/30 rounded-sm"></div>
                        ))}
                    </div>
                </div>

                {/* Marca de la tarjeta (esquina superior derecha) */}
                <div className="absolute top-6 right-6">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {creditCard.brand}
                    </Badge>
                </div>

                {/* Número de tarjeta */}
                <div className="relative mb-6">
                    <p className="text-xl font-mono tracking-[0.25em] drop-shadow-md">
                        {creditCard.last_four
                            ? `•••• •••• •••• ${creditCard.last_four}`
                            : '•••• •••• •••• ••••'
                        }
                    </p>
                </div>

                {/* Información inferior */}
                <div className="relative flex justify-between items-end">
                    {/* Nombre del titular */}
                    <div>
                        <p className="text-[10px] opacity-70 mb-1">TITULAR</p>
                        <p className="text-sm font-semibold uppercase tracking-wider drop-shadow">
                            {creditCard.name}
                        </p>
                    </div>

                    {/* Fecha de vencimiento (opcional) */}
                    {creditCard.expiration_date && (
                        <div className="text-right">
                            <p className="text-[10px] opacity-70 mb-1">VENCE</p>
                            <p className="text-sm font-mono">
                                {new Date(creditCard.expiration_date).toLocaleDateString("es-AR", {
                                    month: "2-digit",
                                    year: "2-digit"
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}