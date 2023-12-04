const convertUTC = (timestamp: number) => {
  const date: Date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const minutes: number = date.getMinutes();
  const hours: number = date.getHours();
  const formattedDateTime: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return formattedDateTime;
}

const convertChinese = (inputString: string) => {
  const chineseCharacters:string = decodeURIComponent(inputString);
  return chineseCharacters;
}

export { convertUTC, convertChinese };