import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TimelineEvent {
    date: string;
    event: string;
    location: string;
}
export type Time = bigint;
export interface Shipment {
    weight: string;
    status: string;
    trackingNumber: string;
    serviceType: string;
    destination: string;
    recipientPhone: string;
    createdAt: Time;
    origin: string;
    estimatedDelivery: string;
    handlingFee: string;
    shippingCost: string;
    senderName: string;
    recipientAddress: string;
    recipientName: string;
    senderAddress: string;
    timeline: Array<TimelineEvent>;
}
export interface UserProfile {
    name: string;
}
export interface TimelineEventInput {
    date: string;
    event: string;
    location: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimFirstAdmin(): Promise<void>;
    createShipment(trackingNumber: string, senderName: string, senderAddress: string, recipientName: string, recipientAddress: string, recipientPhone: string, origin: string, destination: string, weight: string, serviceType: string, estimatedDelivery: string, shippingCost: string, handlingFee: string): Promise<void>;
    deleteShipment(trackingNumber: string): Promise<void>;
    getAllShipments(): Promise<Array<Shipment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getShipment(trackingNumber: string): Promise<Shipment | null>;
    getShipmentsByStatus(status: string): Promise<Array<Shipment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isFirstAdminClaimed(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateShipmentStatus(trackingNumber: string, status: string, event: TimelineEventInput): Promise<void>;
}
