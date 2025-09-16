interface SortStageForCustomersProps {
  sortBy: string;
}

export default function getSortStageForCustomers({
  sortBy,
}: SortStageForCustomersProps): Record<string, 1 | -1> {
  switch (sortBy) {
    case "orders":
      return { totalOrders: -1 };
    case "recency":
      return { lastOrderDate: -1 };
    case "name":
      return { customerName: 1 };
    case "revenue":
    default:
      return { totalSpent: -1 };
  }
}
