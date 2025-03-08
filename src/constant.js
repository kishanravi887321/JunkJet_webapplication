import h3 from "h3-js";

const h3Index1 = "83425afffffffff";


// Use functions directly from `h3`
// const coord1 = h3.h3ToGeo(h3Index1); // [lat, lon]
// const coord2 = h3.h3ToGeo(h3Index2); // [lat, lon]


let x=h3.latLngToCell(26.647321664066062,72.61499061444094,3)
console.log(h3.cellToLatLng(h3Index1))

console.log(x)

