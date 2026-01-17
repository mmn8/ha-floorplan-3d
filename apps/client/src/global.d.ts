// import { Auth, Connection } from "home-assistant-js-websocket";

export { };

declare global {
	interface Window {
		hassConnection: Promise<{
			auth: Auth;
			conn: Connection;

		}>
	}
}
