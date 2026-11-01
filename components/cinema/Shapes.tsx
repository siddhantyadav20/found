/** Hand-cut frames every long page clips its pictures to, in a box of 1×1. */
export default function Shapes() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <clipPath id="found-film" clipPathUnits="objectBoundingBox">
          <path d="M.012.004C.2 0 .8 0 .988.004Q.998.006.998.02C1 .25 1 .75.998.98Q.998.994.988.996C.8 1 .2 1 .012.996Q.002.994.002.98C0 .75 0 .25.002.02Q.002.006.012.004Z" />
        </clipPath>
        <clipPath id="found-square" clipPathUnits="objectBoundingBox">
          <path d="M.03.012.25.004.52.014.78.003.972.016Q.99.02.99.04L.996.3.986.55.997.8.984.968Q.98.988.96.988L.7.996.45.986.2.997.035.984Q.012.98.012.96L.004.7.014.42.003.2.016.04Q.018.014.03.012Z" />
        </clipPath>
        <clipPath id="found-arch" clipPathUnits="objectBoundingBox">
          <path d="M0 1V.235C0 .105.225 0 .5 0S1 .105 1 .235V1H0Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
