import { IconType } from "react-icons";
import {
  FaBatteryFull,
  FaBox,
  FaFan,
  FaLightbulb,
  FaPlug,
  FaScrewdriver,
  FaSolarPanel,
  FaTools,
  FaTree,
  FaWater,
} from "react-icons/fa";

export const getCategoryIcon = (categoryName: string): IconType => {
  switch (categoryName.toLowerCase()) {
    case "solar panels":
      return FaSolarPanel;
    case "solar inverters":
      return FaPlug;
    case "solar batteries":
      return FaBatteryFull;
    case "solar mounting systems":
      return FaTools;
    case "solar accessories":
      return FaScrewdriver;
    case "solar water pumps":
      return FaWater;
    case "solar heating systems":
      return FaLightbulb;
    case "solar lighting":
      return FaLightbulb;
    case "solar kits":
      return FaBox;
    case "solar power tools":
      return FaFan;
    case "green energy solutions":
      return FaTree;
    default:
      return FaTools; // Fallback icon
  }
};
