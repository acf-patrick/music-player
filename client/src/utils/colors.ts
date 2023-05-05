interface Pixel {
  r: number;
  g: number;
  b: number;
}
function getRgbArray(data: number[]) {
  const values: Pixel[] = [];
  const step = data.length % 3 ? 4 : 3;
  for (let i = 0; i < data.length; i += step)
    if (data.length - 4 >= i)
      values.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
      });
  return values;
}

function findBiggestColorRange(rgbValues: Pixel[]) {
  const min: Pixel = {
    r: Number.MAX_VALUE,
    g: Number.MAX_VALUE,
    b: Number.MAX_VALUE,
  };
  const max: Pixel = {
    r: Number.MIN_VALUE,
    g: Number.MIN_VALUE,
    b: Number.MIN_VALUE,
  };

  rgbValues.forEach((pixel) => {
    min.r = Math.min(min.r, pixel.r);
    min.g = Math.min(min.g, pixel.g);
    min.b = Math.min(min.b, pixel.b);

    max.r = Math.max(max.r, pixel.r);
    max.g = Math.max(max.g, pixel.g);
    max.b = Math.max(max.b, pixel.b);
  });

  const range = [max.r - min.r, max.g - min.g, max.b - min.b];

  const biggestRange = Math.max(...range);
  if (biggestRange === range[0]) return "r";
  else if (biggestRange === range[1]) return "g";
  return "b";
}

function quantization(values: Pixel[], depth: number): Pixel[] {
  const MAX_DEPTH = 5;
  if (depth === MAX_DEPTH || values.length === 0) {
    const color = values.reduce(
      (prev, curr) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;
        return prev;
      },
      { r: 0, g: 0, b: 0 }
    );

    color.r = Math.round(color.r / values.length);
    color.g = Math.round(color.g / values.length);
    color.b = Math.round(color.b / values.length);
    return [color];
  }

  const componentToSortBy = findBiggestColorRange(values);
  values.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

  const mid = values.length / 2;
  return [
    ...quantization(values.slice(0, mid), depth + 1),
    ...quantization(values.slice(mid + 1), depth + 1),
  ];
}

// Find dominant color
export default async function createColorPalette(
  datas: number[]
): Promise<Pixel[]> {
  return new Promise((res, rej) => {
    const pixels = quantization(getRgbArray(datas), 0);
    if (pixels.length) res(pixels);
    else rej("Unable to extract color palette.");
  });
}
