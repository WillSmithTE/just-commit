import { useSelector } from "react-redux";
import { RootState } from "../services/reduxStore";
import { Feature } from "../types";

export function useFeature(feature: Feature) {
    const features = useSelector((state: RootState) => state.settings.features)
    return !!features[feature]
}