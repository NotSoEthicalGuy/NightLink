export interface User {
    id: string
    email: string
    name: string
    slug: string
    role: 'PR' | 'ADMIN'
    isVerified?: boolean
    isSubscribed: boolean
    subscriptionPlan?: 'STANDARD' | 'PREMIUM'
    subscriptionStartDate?: string
    subscriptionEndDate?: string
    subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'CANCELED'
    subscriptionExpiresAt?: string
    photoUrl?: string
    createdAt: string
}

export interface Profile {
    id: string
    tenantId: string
    displayName: string
    bio: string
    photoUrl?: string
    coverMediaUrl?: string
    coverMediaType?: 'IMAGE' | 'VIDEO'
    contactInfo: {
        whatsapp?: string
        instagram?: string
        phone?: string
    }
}

export interface SiteConfig {
    id: string
    tenantId: string
    templateId: 'minimalist' | 'party' | 'premium'
    colorPalette: 'blue' | 'purple' | 'gold' | 'red' | 'green'
    fontFamily: 'modern' | 'classic' | 'bold'
    sectionsVisibility: {
        about: { visible: boolean; order: number }
        events: { visible: boolean; order: number }
        contact: { visible: boolean; order: number }
    }
}

export interface Event {
    id: string
    tenantId: string
    name: string
    description: string
    eventDate: string
    eventTime: string
    venueName: string
    venueAddress: string
    coverImageUrl?: string
    isPublished: boolean
    createdAt: string
    updatedAt: string
    ticketTypes?: TicketType[]
}

export interface TicketType {
    id: string
    eventId: string
    name: string
    description?: string
    price: number
    totalQuantity: number
    reservedQuantity: number
    soldQuantity: number
    availableQuantity: number
    createdAt: string
}

export interface Reservation {
    id: string
    reservationCode: string
    ticketTypeId: string
    eventId: string
    tenantId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    quantity: number
    totalAmount: number
    status: 'PENDING_PAYMENT' | 'PAID_CONFIRMED' | 'EXPIRED' | 'CANCELLED'
    expiresAt: string
    confirmedAt?: string
    createdAt: string
    updatedAt: string
    event?: Event
    ticketType?: TicketType
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface SignupData {
    email: string
    password: string
    name: string
    slug: string
}

export interface CreateEventData {
    name: string
    description: string
    eventDate: string
    eventTime: string
    venueName: string
    venueAddress: string
    coverImageUrl?: string
}

export interface CreateTicketTypeData {
    eventId: string
    name: string
    description?: string
    price: number
    totalQuantity: number
}

export interface CreateReservationData {
    ticketTypeId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    quantity: number
}
