import { BedOption, RoomCategory } from "@/src/lib/types"

export const BED_OPTION_LABELS: Record<BedOption, string> = {
  [BedOption.SINGLE]: "Single Bed",
  [BedOption.DOUBLE]: "Double Bed",
  [BedOption.TWIN]: "Twin Beds",
}

export const ROOM_CATEGORY_LABELS: Record<RoomCategory, string> = {
  [RoomCategory.STANDARD]: "Standard Room",
  [RoomCategory.DELUXE]: "Deluxe Room",
  [RoomCategory.SUITE]: "Suite",
}

export const getBedOptionLabel = (bedOption: BedOption): string => {
  return BED_OPTION_LABELS[bedOption] || bedOption
}

export const getRoomCategoryLabel = (category: RoomCategory): string => {
  return ROOM_CATEGORY_LABELS[category] || category
}
