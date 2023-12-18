const convertUTC = (timestamp: number) => {
  const date: Date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const minutes: number = date.getMinutes();
  const hours: number = date.getHours();
  const formattedDateTime: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return formattedDateTime;
}

const convertDate = (timestamp: number) => {
  const date: Date = new Date(timestamp * 1000);
  const year: number = date.getFullYear();
  const month: number = date.getUTCMonth()+1;
  const day: number = date.getDate();
  const formattedDate: string = `${year.toString()}-${month.toString()}-${day.toString()}`;
  return formattedDate;
}

const convertChinese = (inputString: string) => {
  const chineseCharacters:string = decodeURIComponent(inputString);
  return chineseCharacters;
}

export { convertUTC, convertChinese, convertDate };