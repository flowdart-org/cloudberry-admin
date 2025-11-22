import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { useCategoryStore } from "@/store/useCategoryStore";
import { toast } from "@/hooks/use-toast";

export const CATEGORY_QUERY_KEY = ["categories"];

export function useCategories() {
  const queryClient = useQueryClient();
  const { page, limit, search, status } = useCategoryStore();

  const query = useQuery({
    queryKey: [...CATEGORY_QUERY_KEY, { page, limit, search, status }],
    queryFn: () =>
      CATEGORY_SERVICES.getCategories(page, limit, search, status === "all" ? undefined : status),
    select: (res) => res.data,
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: CATEGORY_SERVICES.addCategory,
    onSuccess: () => {
      toast({ title: "Category Created" });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      CATEGORY_SERVICES.updateCategory(id, body),
    onSuccess: () => {
      toast({ title: "Category Updated" });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });

  return { query, createMutation, updateMutation };
}
