"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function NotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("connect", () => {
      console.log("Connected to notification socket");
    });
    socket.on("employee-created", (data: { message: string; employeeId: string; status: string }) => {
      toast.success(data.message, {
        description: `Employee ID: ${data.employeeId}`,
        position: 'top-right'
      });
    });

    socket.on("csv-processed", (data: { message: string; count: number }) => {
      toast.success(data.message, {
        description: `Processed ${data.count} records successfully`,
        position: 'top-right'
      });
      void queryClient.invalidateQueries({ queryKey: ['employee:get-employees'] });
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return null;
}