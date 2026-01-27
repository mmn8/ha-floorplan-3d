export async function fetchResource<T>(url: string, parser?): Promise<T> {
	const response = await fetch(url, { cache: "reload" });
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	const text = await response.text();
	return parser ? parser(text) : (JSON.parse(text) as T);
}
