export function getColor(index: number) {
  const colors = ["#FFBB5C", "#FF9B50", "#E25E3E", "#C63D2F", "#F0A500", "#E45826", "#9C0F48", "#D67D3E"]; // 可以根據需要修改或擴展
  const i = index % colors.length; // 防止索引超出顏色陣列範圍
  return colors[i];
}
