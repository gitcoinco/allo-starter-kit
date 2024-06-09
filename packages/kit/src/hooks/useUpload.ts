import { useMutation } from "@tanstack/react-query";
import { useAPI } from "..";

export function useUpload() {
  const api = useAPI();
  return useMutation({
    mutationFn: async (data: Record<string, unknown> | File) => {
      const formData = new FormData();

      if (!(data instanceof File)) {
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        data = new File([blob], "metadata.json");
      }

      formData.append("file", data);

      return api.upload(formData);
    },
  });
}
