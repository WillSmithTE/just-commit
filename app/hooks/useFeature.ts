import { useSelector } from "react-redux";
import { RootState } from "../services/reduxStore";

export function useFeature(feature: Feature) {
    const features = useSelector((state: RootState) => state.settings.features)
    return !!features[feature]
}

export enum Feature {
    FULL_SCREEN_SAVE_EDIT = 'v2-save-edit',
    NOTHING = 'nothing',
    FULL_RECORD_SCREEN = 'v2-record-button',
    RECORD_FAB_IN_MIDDLE = 'record-fab-in-middle'
  }