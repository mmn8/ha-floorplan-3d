import { useHass } from "@/utils/HaConnect";

import { useBottomSheetStore } from "@/store";
import { IAction } from "@/types/types"
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

export function useEvaluateAction() {
	const { callService } = useHass();
	const { openBottomSheet } = useBottomSheetStore()
	const { vibrate } = useHapticFeedback();


	const evaluateAction = (action: IAction) => {
		_evaluateAction(action, callService, openBottomSheet, vibrate)
	};

	return { evaluateAction }
}


const _evaluateAction = async (action: IAction, callService, openBottomSheet, vibrate) => {
	if (!action) return;

	switch (action.action) {
		case "call-service": {
			const [domain, serviceName] = action.service.split(".");
			callService(
				domain,
				serviceName,
				{
					entity_id: action.target.entity_id,
				},
			);
			break;
		}

		case "more-info":
			openBottomSheet();
			vibrate('medium')
			break;

		case "hass-more-info":
			window.top.document.querySelector("home-assistant").dispatchEvent(
				new CustomEvent("hass-more-info", {
					detail: { entityId: action?.target?.entity_id },
					bubbles: true,
					composed: true,
				}),
			);
			break
		default:
			break;
	}
};

