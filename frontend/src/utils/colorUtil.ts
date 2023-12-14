export function getColor(index: number) {
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#800080", "#FFA500", "#00FFFF", "#FFC0CB"]; // 可以根據需要修改或擴展
  const i = index % colors.length; // 防止索引超出顏色陣列範圍
  return colors[i];
}
