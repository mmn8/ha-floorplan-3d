// import { useHomeStore } from "@/store/HomeStore";
// import { useErrorStore, ErrorType } from "@/store/ErrorStore";
// import { XMLParser } from "fast-xml-parser";
// import { parse } from "yaml";
// import { BuildingSchema } from "@/types";
// import type { IHomeConfig, IBuilding, IHomeData, IBuildingData } from "@/types";
//
// async function fetchResource<T>(url: string, parser?): Promise<T> {
//   try {
//     const response = await fetch(url, { cache: "reload" });
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const text = await response.text();
//     return parser ? await parser(text) : JSON.parse(text);
//   } catch (err) {
//     throw { url, originalError: err };
//   }
// }
//
// interface AppConfig {
//   configured: boolean;
// }

// export function useLoadHome(setIsLoading, setConfig) {
//   const { setHome } = useHomeStore();
//   const { addError, reset } = useErrorStore();
//
//   const fetchHomeData = async () => {
//     reset();
//     const controller = new AbortController();
//     setIsLoading(true);
//
//     try {
//       const [appConfig, parsedHome] = await Promise.all([
//         fetchResource<AppConfig>("./api/configuration"),
//         fetchResource<IHomeConfig>("./config/home.yml", parse),
//       ]);
//
//       setConfig(appConfig);
//
//       if (!parsedHome.buildings || parsedHome.buildings.length === 0) {
//         throw new Error("No buildings defined in home.yml");
//       }
//
//       const buildingFileName = parsedHome.buildings[0];
//       const parsedBuilding = await fetchResource<IBuilding>(
//         `./config/${buildingFileName}`,
//         parse,
//       );
//
//       const floorplanName = parsedBuilding.floorplan_name;
//       const parsedFloorplanXML = await fetchResource(
//         `./config/${floorplanName}`,
//         (text) => {
//           const parser = new XMLParser({
//             ignoreAttributes: false,
//             attributeNamePrefix: "",
//           });
//           return parser.parse(text)?.home;
//         },
//       );
//
//       const building = {
//         title: parsedBuilding.title,
//         floorplan_name: parsedBuilding.floorplan_name,
//         floorplan: parsedFloorplanXML,
//         rooms: parsedBuilding.rooms,
//         default_rooms: parsedBuilding.default_rooms,
//       } as IBuildingData;
//
//       const home = {
//         title: parsedHome.name,
//         buildings: [building],
//       } as IHomeData;
//
//       //TODO: handle the safe parse :)
//       const result = BuildingSchema.safeParse(parsedBuilding);
//       if (!result.success) {
//         console.log(result.error.issues);
//         result.error.issues.map((issue) => {
//           addError({
//             type: ErrorType.ZOD_ERROR,
//             title: issue.message,
//             description: issue.path.join("/"),
//           });
//         });
//       }
//
//       setHome(home);
//     } catch (err) {
//       const description = err.originalError
//         ? String(err.originalError)
//         : String(err);
//       const title = err.url
//         ? `Error loading ${err.url}`
//         : "Configuration Error";
//
//       addError({
//         type: ErrorType.FATAL,
//         title: title,
//         description: description,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//
//     return () => controller.abort();
//   };
//
//   return fetchHomeData;
// }
