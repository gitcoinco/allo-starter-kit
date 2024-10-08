import { useMutation } from "@tanstack/react-query";
import { useAPI } from "../services/provider";

export function useUpload() {
  const api = useAPI();
  return useMutation({
    mutationFn: async (data: Record<string, unknown> | File) => api.upload(data),
  });
}
