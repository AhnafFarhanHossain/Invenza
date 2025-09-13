interface SortStageProps {
  sortBy: string;
}

function getSortStage({ sortBy }: SortStageProps): Record<string, 1 | -1> {
  switch (sortBy) {
    case "quantity":
      return { totalQuantitySold: -1 }; // Descending
    case "name":
      return { productName: 1 }; // Ascending alphabetical
    case "revenue":
    default:
      return { totalRevenue: -1 }; // Descending (default)
  }
}
export default getSortStage;
