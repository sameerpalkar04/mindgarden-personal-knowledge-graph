import api from "./api";

export function getGraph() {
  return api.get("/graph");
}