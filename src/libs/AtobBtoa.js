import { globalObject } from "./globalObject.js";

const atob = globalObject.atob.bind(globalObject);
const btoa = globalObject.btoa.bind(globalObject);

export { atob, btoa };
