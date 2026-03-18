import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Shipment, TimelineEventInput } from "../backend.d";
import { useActor } from "./useActor";

export function useGetShipment(trackingNumber: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Shipment | null>({
    queryKey: ["shipment", trackingNumber],
    queryFn: async () => {
      if (!actor || !trackingNumber) return null;
      return actor.getShipment(trackingNumber);
    },
    enabled: !!actor && !isFetching && !!trackingNumber,
  });
}

export function useGetAllShipments() {
  const { actor, isFetching } = useActor();
  return useQuery<Shipment[]>({
    queryKey: ["shipments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShipments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsFirstAdminClaimed() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isFirstAdminClaimed"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isFirstAdminClaimed() as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).claimFirstAdmin() as Promise<void>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
      qc.invalidateQueries({ queryKey: ["isFirstAdminClaimed"] });
    },
  });
}

export function useCreateShipment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      trackingNumber: string;
      senderName: string;
      senderAddress: string;
      recipientName: string;
      recipientAddress: string;
      recipientPhone: string;
      origin: string;
      destination: string;
      weight: string;
      serviceType: string;
      estimatedDelivery: string;
      shippingCost: string;
      handlingFee: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createShipment(
        data.trackingNumber,
        data.senderName,
        data.senderAddress,
        data.recipientName,
        data.recipientAddress,
        data.recipientPhone,
        data.origin,
        data.destination,
        data.weight,
        data.serviceType,
        data.estimatedDelivery,
        data.shippingCost,
        data.handlingFee,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  });
}

export function useUpdateShipmentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      trackingNumber: string;
      status: string;
      event: TimelineEventInput;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateShipmentStatus(
        data.trackingNumber,
        data.status,
        data.event,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  });
}

export function useDeleteShipment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (trackingNumber: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteShipment(trackingNumber);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  });
}
