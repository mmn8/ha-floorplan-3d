import YAML from "yaml";
import { fetchResource } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { IUISchema } from "@/types";

// TODO: Improve this
// export async function loadUI(ui_file: string) {
//   async function f() {
//     const resp = await fetch("./config/" + ui_file, { cache: "reload" });
//     const ui = await resp.text();
//     let parsed = undefined;
//
//     try {
//       parsed = await parse(ui);
//     } catch (err) {
//       console.error(err);
//       return;
//     }
//
//     return parsed;
//   }
//
//   return f();
// }

export function useUI(ui: string) {
  const uiQuery = useQuery({
    queryKey: ["ui"],
    queryFn: () => fetchResource<IUISchema>("./config/" + ui, YAML.parse),
    staleTime: Infinity,
  });

  return { ...uiQuery };
}
