import moment from 'moment';

export function formatYYYYMMDD(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}
